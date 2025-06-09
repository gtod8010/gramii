package com.gramii.smsforwarder.network

import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.Header
import retrofit2.http.POST
import retrofit2.http.Url

interface ApiService {
    @POST
    suspend fun forwardSms(
        @Url url: String,
        @Header("Authorization") token: String,
        @Body payload: SmsPayload
    ): Response<Unit>
} 
