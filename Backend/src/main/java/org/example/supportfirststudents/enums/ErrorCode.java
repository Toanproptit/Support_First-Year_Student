package org.example.supportfirststudents.enums;


import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    USER_EXISTED(1001, "User existed", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1002, "Username cannot be blank", HttpStatus.BAD_REQUEST),
    PASSWORD_INVALID(1003, "Password is incorrect", HttpStatus.BAD_REQUEST),
    EMAIL_INVALID(1004, "Email invalid", HttpStatus.BAD_REQUEST),
    INVALID_KEY(1005, "Key invalid", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED(1006, "You do not have permission", HttpStatus.FORBIDDEN),
    USER_NOT_FOUND(1007, "User not found", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1008, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    FILE_UPLOAD_ERROR(1009, "Cannot upload file", HttpStatus.BAD_REQUEST),
    SIGN_TYPE_NOT_FOUND(1012, "Sign type not found", HttpStatus.NOT_FOUND),
    DETECTION_NOT_FOUND(1013, "Detection not found", HttpStatus.NOT_FOUND),
    COOKIE_NOT_FOUND(1010, "Cookie not found", HttpStatus.BAD_REQUEST),
    ROBOFLOW_ERROR(1011, "Error calling Roboflow API", HttpStatus.BAD_REQUEST),
    REPROCESS_VIDEO_ERROR(1012, "Reprocess video failed", HttpStatus.BAD_REQUEST),
    FILE_TOO_LARGE(1014, "File too large", HttpStatus.BAD_REQUEST),
    DETECTION_ERROR(1015, "Cannot detect video", HttpStatus.BAD_REQUEST),
    UPDATE_INFO_ERROR(1016, "Cannot update info", HttpStatus.BAD_REQUEST),
    USERNAME_EXISTED(1017, "Username existed", HttpStatus.BAD_REQUEST),
    EMAIL_EXISTED(1018, "Email existed", HttpStatus.BAD_REQUEST),
    FOOD_NOT_FOUND(1019, "Food not found", HttpStatus.NOT_FOUND),
    CUSTOMER_NOT_FOUND(1020, "Customer not found", HttpStatus.NOT_FOUND),
    DINING_TABLE_NOT_FOUND(1021, "Dining table not found", HttpStatus.NOT_FOUND),
    ORDER_NOT_FOUND(1022, "Order not found", HttpStatus.NOT_FOUND),
    ORDER_DETAIL_NOT_FOUND(1023, "Order detail not found", HttpStatus.NOT_FOUND),
    INVOICE_ALREADY_EXISTS(1024, "Order already has an invoice", HttpStatus.BAD_REQUEST),
    RESERVATION_DETAIL_NOT_FOUND(1025, "Reservation detail not found", HttpStatus.NOT_FOUND),
    RESERVATION_NOT_FOUND(1026, "Reservation not found", HttpStatus.NOT_FOUND),
    TOKEN_GENERATION_FAILED(1027, "Cannot create token", HttpStatus.INTERNAL_SERVER_ERROR),
    FOOD_ID_REQUIRED(1028, "Food id is required", HttpStatus.BAD_REQUEST),
    RESERVATION_CUSTOMER_REQUIRED(1029, "Customer is required when reservation is confirmed", HttpStatus.BAD_REQUEST),
    RESERVATION_STATUS_INVALID(1030, "Invalid reservation status transition", HttpStatus.BAD_REQUEST),
    RESERVATION_TABLE_REQUIRED_FOR_CHECK_IN(1031, "Reservation must have at least one assigned table before check-in", HttpStatus.BAD_REQUEST),
    DATA_INTEGRITY_VIOLATION(1032, "Database data integrity violation", HttpStatus.BAD_REQUEST),
    POST_NOT_FOUND(1033, "Post not found", HttpStatus.NOT_FOUND),
    COMMENT_NOT_FOUND(1034, "Comment not found", HttpStatus.NOT_FOUND),
    ;

    final int code;
    final String message;
    final HttpStatusCode statusCode;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    public HttpStatusCode getStatusCode() {
        return statusCode;
    }
}