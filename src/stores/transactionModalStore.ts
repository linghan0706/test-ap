"use client"

import { create } from 'zustand'

export type PurchasePayload = {
  id?: string
  icon?: string
  title?: string
}

interface TransactionModalState {
  isOpen: boolean
  payload?: PurchasePayload
  openModal: (payload: PurchasePayload) => void
  closeModal: () => void
}

export const useTransactionModalStore = create<TransactionModalState>((set) => ({
  isOpen: false,
  payload: undefined,
  openModal: (payload) => {
    console.log('[transaction-modal] open', payload)
    try { sessionStorage.setItem('last-purchase', JSON.stringify(payload)) } catch {}
    set({ isOpen: true, payload })
  },
  closeModal: () => {
    console.log('[transaction-modal] close')
    set({ isOpen: false, payload: undefined })
  },
}))