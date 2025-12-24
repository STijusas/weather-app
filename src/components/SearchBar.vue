<template>
  <div class="field">
    <div class="control has-icons-left">
      <input
        class="input is-medium"
        type="text"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <span class="icon is-left">
        <i class="fas fa-search"></i>
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Search...' }
})

defineEmits(['update:modelValue'])
</script>