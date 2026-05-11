package com.quanlydaotao.backend.user.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PersonSearchRequest {

    private String keyword;

    private String gender;

    private Boolean isActive;
}