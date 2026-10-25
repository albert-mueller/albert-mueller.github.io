<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useStrings } from '../i18n'
import {
    disableNotifications,
    enableNotifications,
    getStatus,
    hasBackgroundChecks,
    type NotifyStatus,
} from '../notify'

const t = useStrings()
// Rendered only in the browser: the status depends on browser APIs.
const status = ref<NotifyStatus | 'loading'>('loading')
const background = ref(false)
const busy = ref(false)
const failed = ref(false)

onMounted(async () => {
    status.value = getStatus()
    if (status.value === 'on') background.value = await hasBackgroundChecks()
})

async function run(action: () => Promise<NotifyStatus>) {
    busy.value = true
    failed.value = false
    try {
        status.value = await action()
        background.value = status.value === 'on' && await hasBackgroundChecks()
    } catch {
        failed.value = true
        status.value = getStatus()
    } finally {
        busy.value = false
    }
}

const enable = () => run(() => enableNotifications(t.value.lang))
const disable = () => run(disableNotifications)
</script>

<template>
    <div v-if="status !== 'loading'" class="notify-box">
        <template v-if="status === 'off'">
            <button type="button" class="notify-button" :disabled="busy" @click="enable">
                🔔 {{ t.notify.enable }}
            </button>
            <p class="notify-hint">{{ t.notify.hintOff }}</p>
        </template>
        <template v-else-if="status === 'on'">
            <p class="notify-state">✓ {{ t.notify.on }}</p>
            <p class="notify-hint">{{ background ? t.notify.background : t.notify.foreground }}</p>
            <button type="button" class="notify-button notify-button-alt" :disabled="busy" @click="disable">
                {{ t.notify.disable }}
            </button>
        </template>
        <p v-else class="notify-hint">{{ t.notify[status] }}</p>
        <p v-if="failed" class="notify-hint notify-error">{{ t.notify.error }}</p>
    </div>
</template>
