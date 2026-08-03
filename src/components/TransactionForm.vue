<template>
  <form @submit.prevent="submit" class="card p-5 space-y-4">
    <h3 class="font-semibold text-gray-800 dark:text-gray-100">
      {{ editingId ? 'Edit' : 'Add' }} {{ type === 'expense' ? 'Expense' : 'Income' }}
    </h3>
    <div class="grid sm:grid-cols-2 gap-4">
      <div>
        <label class="label">Category</label>
        <select v-model="form.category_id" class="input" required>
          <option value="" disabled>Select category</option>
          <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.icon }} {{ c.name }}</option>
        </select>
      </div>
      <div>
        <label class="label">Amount ({{ baseCurrency }})</label>
        <input v-model.number="form.amount" type="number" min="0.01" step="0.01" class="input" required placeholder="0.00" />
      </div>
      <div>
        <label class="label">Date</label>
        <input v-model="form.occurred_on" type="date" class="input" required />
      </div>
      <div>
        <label class="label">Description (optional)</label>
        <input v-model="form.description" type="text" class="input" placeholder="e.g. Weekly groceries" />
      </div>
    </div>
    <div class="flex gap-3">
      <button type="submit" class="btn-primary" :disabled="saving">
        {{ saving ? 'Saving…' : editingId ? 'Save changes' : `Add ${type === 'expense' ? 'expense' : 'income'}` }}
      </button>
      <button v-if="editingId" type="button" class="btn-secondary" @click="cancelEdit">Cancel</button>
    </div>
  </form>
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue'
import { useFinanceStore } from '../stores/finance'
import { useCurrency } from '../composables/useCurrency'

const props = defineProps({
  type: { type: String, required: true }, // 'expense' | 'income'
  editingTransaction: { type: Object, default: null }
})
const emit = defineEmits(['done'])

const finance = useFinanceStore()
const { baseCurrency } = useCurrency()
const saving = ref(false)
const editingId = ref(null)

const categories = computed(() => finance.categories.filter((c) => c.kind === props.type))

function emptyForm() {
  return {
    category_id: '',
    amount: null,
    occurred_on: new Date().toISOString().slice(0, 10),
    description: ''
  }
}

const form = reactive(emptyForm())

watch(
  () => props.editingTransaction,
  (tx) => {
    if (tx) {
      editingId.value = tx.id
      form.category_id = tx.category_id || ''
      form.amount = tx.amount
      form.occurred_on = tx.occurred_on
      form.description = tx.description || ''
    }
  },
  { immediate: true }
)

async function submit() {
  saving.value = true
  const payload = {
    category_id: form.category_id,
    type: props.type,
    amount: form.amount,
    occurred_on: form.occurred_on,
    description: form.description,
    currency: baseCurrency.value
  }
  if (editingId.value) {
    await finance.updateTransaction(editingId.value, payload)
  } else {
    await finance.addTransaction(payload)
  }
  saving.value = false
  Object.assign(form, emptyForm())
  editingId.value = null
  emit('done')
}

function cancelEdit() {
  Object.assign(form, emptyForm())
  editingId.value = null
  emit('done')
}
</script>
