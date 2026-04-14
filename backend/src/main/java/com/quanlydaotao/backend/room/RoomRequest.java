package com.quanlydaotao.backend.room;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomRequest {

    @NotBlank
    private String roomCode;

    @NotBlank
    private String roomName;

    @NotNull
    private UUID buildingId;

    @NotNull
    private Integer capacity;

    @NotBlank
    private String roomType;

    @NotBlank
    private String status;
}
