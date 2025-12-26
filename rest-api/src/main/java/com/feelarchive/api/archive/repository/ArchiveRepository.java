package com.feelarchive.api.archive.repository;

import com.feelarchive.api.archive.domain.Archive;
import com.feelarchive.api.user.domain.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArchiveRepository extends JpaRepository<Archive, Long> {

  List<Archive> findByUser(User user);
}
