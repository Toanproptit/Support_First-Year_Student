package org.example.supportfirststudents.dto.request;

import jakarta.validation.constraints.NotBlank;

public class CreateFaculty {
    @NotBlank
    private String name;

    @NotBlank
    private String code;

    public CreateFaculty() {
    }

    public CreateFaculty(String name, String code) {
        this.name = name;
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
