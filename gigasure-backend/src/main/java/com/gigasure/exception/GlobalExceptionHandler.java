package com.gigasure.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleAllExceptions(Exception ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", "Internal Server Error");
        body.put("message", ex.getMessage());
        body.put("type", ex.getClass().getSimpleName());
        
        // Include stack trace first few lines for easier debugging
        StackTraceElement[] stackTrace = ex.getStackTrace();
        if (stackTrace != null && stackTrace.length > 0) {
            body.put("location", stackTrace[0].toString());
        }

        System.err.println(">>> SERVER ERROR: " + ex.getMessage());
        ex.printStackTrace();

        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
