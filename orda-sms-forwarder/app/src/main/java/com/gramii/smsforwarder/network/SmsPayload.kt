package com.gramii.smsforwarder.network

data class SmsPayload(
    val from: String,
    val body: String,
    val receivedAt: String
) 
