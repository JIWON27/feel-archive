package com.feelarchive.api.exception;

import java.util.HashMap;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(com.feelarchive.common.excepion.FeelArchiveException.class)
  public ResponseEntity<ExceptionResponse> handleBusinessException(
      com.feelarchive.common.excepion.FeelArchiveException e) {
    log.warn("[비지니스 예외] status={} code={} custom_msg={} exception_msg={}",
        e.getErrorCode().getStatus(),
        e.getErrorCode().getCode(),
        e.getErrorCode().getMessage(),
        e.getMessage());
    ExceptionResponse body = new ExceptionResponse(
        e.getErrorCode().getCode(),
        e.getErrorCode().getMessage()
    );
    return ResponseEntity.status(e.getErrorCode().getStatus()).body(body);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String,String>> methodArgumentNotValidException(MethodArgumentNotValidException e){
    Map<String, String> errors = new HashMap<>();
    e.getBindingResult().getFieldErrors()
        .forEach((fieldError) -> errors.put(fieldError.getField(), fieldError.getDefaultMessage()));
    log.warn("[바인딩 예외] errors={}", errors);
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ExceptionResponse> handleException(Exception e) {
    log.error("[서버 예외]", e);
    ExceptionResponse body = new ExceptionResponse("INTERNAL_SERVER_ERROR", "서버 오류가 발생했습니다.");
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
  }
}
