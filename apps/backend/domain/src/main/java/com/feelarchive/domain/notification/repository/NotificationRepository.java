package com.feelarchive.domain.notification.repository;

import com.feelarchive.domain.notification.entity.Notification;
import com.feelarchive.domain.user.entity.User;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.cglib.core.Local;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

  @Modifying(clearAutomatically = true)
  @Query("UPDATE Notification n SET n.read = true, n.readAt = :now WHERE n.user.id = :userId and n.read = false")
  void bulkMarkAsRead(@Param("userId") Long userId, @Param("now") LocalDateTime now);
}
