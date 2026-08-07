# EduSurvey - Disaster Recovery & Backup Guide

This guide details generating database snapshot backups and executing disaster recovery.

---

## 1. Automated & Manual JSON Snapshot Backup

1. Navigate to `/admin/settings`.
2. Click the **Database Backup** tab.
3. Click **Download Full JSON Backup Snapshot**.
4. The system packages all surveys, questions, options, student responses, and institutional settings into a timestamped `.json` file.

---

## 2. Disaster Recovery & System Restore

1. In case of server failure or database corruption, log in to `/admin/settings`.
2. Navigate to **Database Backup > Restore Database Snapshot**.
3. Select the target `.json` backup file.
4. The system validates and restores all tables and state automatically.
