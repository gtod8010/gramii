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
        loadSettings()
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
    }
    
    override fun onPause() {
        super.onPause()
        saveSettings()
    }

    private fun saveSettings() {
        prefs.edit().apply {
            putString(PREF_API_URL, binding.apiUrlEditText.text.toString())
            putString(PREF_API_TOKEN, binding.apiTokenEditText.text.toString())
            apply()
        }
        Toast.makeText(this, "Settings saved!", Toast.LENGTH_SHORT).show()
    }

    private fun loadSettings() {
        binding.apiUrlEditText.setText(prefs.getString(PREF_API_URL, ""))
        binding.apiTokenEditText.setText(prefs.getString(PREF_API_TOKEN, ""))
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

    companion object {
        const val PREFS_NAME = "SmsForwarderPrefs"
        const val PREF_API_URL = "ApiUrl"
        const val PREF_API_TOKEN = "ApiToken"

        const val ACTION_LOG_UPDATE = "com.gramii.smsforwarder.LOG_UPDATE"
        const val EXTRA_LOG_MESSAGE = "log_message"
        
        private const val PERMISSION_REQUEST_CODE = 101
    }
} 
