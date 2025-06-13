package com.gramii.smsforwarder

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.provider.Telephony
import android.util.Log
import com.gramii.smsforwarder.network.ApiClient
import com.gramii.smsforwarder.network.SmsPayload
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

class SmsReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Telephony.Sms.Intents.SMS_RECEIVED_ACTION) {
            val messages = Telephony.Sms.Intents.getMessagesFromIntent(intent)
            val fullMessage = StringBuilder()
            var sender = ""

            messages.forEach { sms ->
                fullMessage.append(sms.messageBody)
                sender = sms.originatingAddress ?: ""
            }

            Log.d(TAG, "SMS Received from $sender: $fullMessage")
            sendToServer(context, sender, fullMessage.toString())
        }
    }

    private fun sendToServer(context: Context, from: String, body: String) {
        val apiUrl = "http://211.45.162.83:3000/api/sms-incoming"
        
        val isoFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.getDefault())
        isoFormat.timeZone = TimeZone.getTimeZone("UTC")
        val receivedAt = isoFormat.format(Date())

        val payload = SmsPayload(from = from, body = body, receivedAt = receivedAt)
        
        CoroutineScope(Dispatchers.IO).launch {
            try {
                logToActivity(context, "Forwarding SMS from $from...")
                val response = ApiClient.instance.forwardSms(apiUrl, "", payload)
                if (response.isSuccessful) {
                    Log.i(TAG, "SMS successfully forwarded to $apiUrl")
                    logToActivity(context, "SUCCESS: SMS from $from forwarded.")
                } else {
                    val errorBody = response.errorBody()?.string()
                    Log.e(TAG, "Failed to forward SMS. Code: ${response.code()}, Body: $errorBody")
                    logToActivity(context, "FAIL: Code ${response.code()} - $errorBody")
                }
            } catch (e: Exception) {
                Log.e(TAG, "Exception while forwarding SMS", e)
                logToActivity(context, "EXCEPTION: ${e.message}")
            }
        }
    }

    private fun logToActivity(context: Context, message: String) {
        val intent = Intent(MainActivity.ACTION_LOG_UPDATE)
        intent.putExtra(MainActivity.EXTRA_LOG_MESSAGE, "[${getCurrentTimestamp()}] $message\n")
        context.sendBroadcast(intent)
    }

    private fun getCurrentTimestamp(): String {
        return SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault()).format(Date())
    }

    companion object {
        private const val TAG = "SmsReceiver"
    }
} 
