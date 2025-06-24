package com.onezinnia.dashboard.model;

import java.time.LocalDateTime;

public class ApiResponse<T> {
    private String status;
    private LocalDateTime timestamp;
    private String message;
    private T data;

    public ApiResponse(String status, String message, T data) {
        this.status = status;
        this.timestamp = LocalDateTime.now();
        this.message = message;
        this.data = data;
    }

    public String getStatus() { return status; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public String getMessage() { return message; }
    public T getData() { return data; }
}
