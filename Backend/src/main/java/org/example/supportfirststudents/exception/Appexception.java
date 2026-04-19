package org.example.supportfirststudents.exception;

import org.example.supportfirststudents.enums.ErrorCode;

public class Appexception extends RuntimeException {

    private ErrorCode errorCode;
    public Appexception(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}
