package com.gramii.smsforwarder

import android.Manifest
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.SharedPreferences
import android.content.pm.PackageManager
import android.os.Bundle
import android.text.method.ScrollingMovementMethod
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.LinearLayoutManager
import com.gramii.smsforwarder.databinding.ActivityMainBinding
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var prefs: SharedPreferences
    private lateinit var logAdapter: LogAdapter
    private val logMessages = mutableListOf<String>()
    private val gson = Gson()
    
    private val logReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            intent?.getStringExtra(EXTRA_LOG_MESSAGE)?.let { message ->
                addLogMessage(message)
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

        setupUI()
        loadLogs()
        checkAndRequestPermissions()
        
        val intentFilter = IntentFilter(ACTION_LOG_UPDATE)
        ContextCompat.registerReceiver(this, logReceiver, intentFilter, ContextCompat.RECEIVER_NOT_EXPORTED)
    }

    override fun onDestroy() {
        super.onDestroy()
        unregisterReceiver(logReceiver)
    }

    private fun setupUI() {
        binding.logRecyclerView.layoutManager = LinearLayoutManager(this)
        logAdapter = LogAdapter(logMessages)
        binding.logRecyclerView.adapter = logAdapter

        binding.permissionButton.setOnClickListener {
            checkAndRequestPermissions()
        }
        binding.testSendButton.setOnClickListener {
            sendTestSms()
        }
        binding.clearLogsButton.setOnClickListener {
            clearLogs()
        }
    }
    
    override fun onPause() {
        super.onPause()
        saveLogs()
    }

    private fun checkAndRequestPermissions() {
        val requiredPermissions = arrayOf(
            Manifest.permission.RECEIVE_SMS,
            Manifest.permission.READ_SMS
        )
        val permissionsToRequest = requiredPermissions.filter {
            ContextCompat.checkSelfPermission(this, it) != PackageManager.PERMISSION_GRANTED
        }

        if (permissionsToRequest.isEmpty()) {
            addLogMessage("All permissions granted. Ready to receive SMS.")
        } else {
            ActivityCompat.requestPermissions(this, permissionsToRequest.toTypedArray(), PERMISSION_REQUEST_CODE)
        }
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == PERMISSION_REQUEST_CODE) {
            if (grantResults.isNotEmpty() && grantResults.all { it == PackageManager.PERMISSION_GRANTED }) {
                addLogMessage("Permissions granted successfully! Ready to receive SMS.")
                Toast.makeText(this, "Permissions Granted!", Toast.LENGTH_SHORT).show()
            } else {
                addLogMessage("Some permissions were denied. The app might not work correctly.")
                Toast.makeText(this, "Permissions Denied!", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun sendTestSms() {
        val apiUrl = "https://211.45.162.83:3000/api/sms-incoming/test"
        val from = "010-0000-0000"
        val body = "[테스트] Gramii SMS Forwarder Test Message"
        val isoFormat = java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", java.util.Locale.getDefault())
        isoFormat.timeZone = java.util.TimeZone.getTimeZone("UTC")
        val receivedAt = isoFormat.format(java.util.Date())
        val payload = com.gramii.smsforwarder.network.SmsPayload(from, body, receivedAt)
        kotlinx.coroutines.CoroutineScope(kotlinx.coroutines.Dispatchers.IO).launch {
            try {
                runOnUiThread { addLogMessage("Sending test SMS...") }
                val response = com.gramii.smsforwarder.network.ApiClient.instance.forwardSms(apiUrl, "", payload)
                if (response.isSuccessful) {
                    runOnUiThread { addLogMessage("SUCCESS (${response.code()}): Test SMS sent.") }
                } else {
                    val errorBody = response.errorBody()?.string()
                    runOnUiThread { addLogMessage("FAIL (${response.code()}): $errorBody") }
                }
            } catch (e: Exception) {
                runOnUiThread { addLogMessage("EXCEPTION: ${e.message}") }
            }
        }
    }

    private fun addLogMessage(message: String) {
        val timestampedMessage = "[${getCurrentTimestamp()}] $message"
        logMessages.add(0, timestampedMessage) // Add to the top of the list
        logAdapter.notifyDataSetChanged()
    }

    private fun clearLogs() {
        logMessages.clear()
        logAdapter.notifyDataSetChanged()
        saveLogs()
    }
    
    private fun saveLogs() {
        val json = gson.toJson(logMessages)
        prefs.edit().putString(KEY_LOGS, json).apply()
    }

    private fun loadLogs() {
        val json = prefs.getString(KEY_LOGS, null)
        if (json != null) {
            val type = object : TypeToken<MutableList<String>>() {}.type
            val savedLogs: MutableList<String> = gson.fromJson(json, type)
            logMessages.addAll(savedLogs)
            logAdapter.notifyDataSetChanged()
        }
    }

    private fun getCurrentTimestamp(): String {
        return java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss", java.util.Locale.getDefault()).format(java.util.Date())
    }

    companion object {
        const val PREFS_NAME = "SmsForwarderPrefs"
        const val KEY_LOGS = "sms_logs"
        const val ACTION_LOG_UPDATE = "com.gramii.smsforwarder.LOG_UPDATE"
        const val EXTRA_LOG_MESSAGE = "log_message"
        
        private const val PERMISSION_REQUEST_CODE = 101
    }
} 
