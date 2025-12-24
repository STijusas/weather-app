<template>
  <div class="notification-container">
    <TransitionGroup name="fade">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="['notification', `is-${notification.type}`]"
        class="mb-2"
      >
        <button class="delete" @click="removeNotification(notification.id)"></button>
        {{ notification.message }}
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useNotification } from '../composables/useNotification'

const { notifications, removeNotification } = useNotification()
</script>