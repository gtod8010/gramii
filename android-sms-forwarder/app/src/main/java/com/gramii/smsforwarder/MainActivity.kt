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
import com.gramii.smsforwarder.databinding.ActivityMainBinding
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var prefs: SharedPreferences
    
    private val logReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            intent?.getStringExtra(EXTRA_LOG_MESSAGE)?.let { message ->
                binding.logTextView.append(message)
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

        setupUI()
        checkAndRequestPermissions()
        
        val intentFilter = IntentFilter(ACTION_LOG_UPDATE)
        ContextCompat.registerReceiver(this, logReceiver, intentFilter, ContextCompat.RECEIVER_NOT_EXPORTED)
    }

    override fun onDestroy() {
        super.onDestroy()
        unregisterReceiver(logReceiver)
    }

    private fun setupUI() {
        binding.logTextView.movementMethod = ScrollingMovementMethod()
        binding.permissionButton.setOnClickListener {
            checkAndRequestPermissions()
        }
        binding.testSendButton.setOnClickListener {
            sendTestSms()
        }
    }
    
    override fun onPause() {
        super.onPause()
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
            binding.logTextView.text = "All permissions granted. Ready to receive SMS.\n"
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
                binding.logTextView.text = "Permissions granted successfully! Ready to receive SMS.\n"
                Toast.makeText(this, "Permissions Granted!", Toast.LENGTH_SHORT).show()
            } else {
                binding.logTextView.text = "Some permissions were denied. The app might not work correctly.\n"
                Toast.makeText(this, "Permissions Denied!", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun sendTestSms() {
        val apiUrl = "http://192.168.45.40:3000/api/sms-incoming"
        val from = "010-0000-0000"
        val body = "[테스트] Gramii SMS Forwarder Test Message"
        val isoFormat = java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", java.util.Locale.getDefault())
        isoFormat.timeZone = java.util.TimeZone.getTimeZone("UTC")
        val receivedAt = isoFormat.format(java.util.Date())
        val payload = com.gramii.smsforwarder.network.SmsPayload(from, body, receivedAt)
        kotlinx.coroutines.CoroutineScope(kotlinx.coroutines.Dispatchers.IO).launch {
            try {
                runOnUiThread { binding.logTextView.append("[${getCurrentTimestamp()}] Sending test SMS...\n") }
                val response = com.gramii.smsforwarder.network.ApiClient.instance.forwardSms(apiUrl, "", payload)
                if (response.isSuccessful) {
                    runOnUiThread { binding.logTextView.append("[${getCurrentTimestamp()}] SUCCESS: Test SMS sent.\n") }
                } else {
                    val errorBody = response.errorBody()?.string()
                    runOnUiThread { binding.logTextView.append("[${getCurrentTimestamp()}] FAIL: Code ${response.code()} - $errorBody\n") }
                }
            } catch (e: Exception) {
                runOnUiThread { binding.logTextView.append("[${getCurrentTimestamp()}] EXCEPTION: ${e.message}\n") }
            }
        }
    }

    private fun getCurrentTimestamp(): String {
        return java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss", java.util.Locale.getDefault()).format(java.util.Date())
    }

    companion object {
        const val PREFS_NAME = "SmsForwarderPrefs"
        const val ACTION_LOG_UPDATE = "com.gramii.smsforwarder.LOG_UPDATE"
        const val EXTRA_LOG_MESSAGE = "log_message"
        
        private const val PERMISSION_REQUEST_CODE = 101
    }
} 
