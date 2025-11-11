"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

type GiftPropsModalProps = {
  visible?: boolean
  defaultUsername?: string
  defaultAmount?: number
  onCancel?: () => void
  onConfirm?: (payload: { username: string; amount: number }) => void
  className?: string
}

export default function GiftProps({
  visible = true,
  defaultUsername = "",
  defaultAmount = 1,
  onCancel,
  onConfirm,
  className = "",
}: GiftPropsModalProps) {
  const [username, setUsername] = useState(defaultUsername)
  const [amount, setAmount] = useState<number>(defaultAmount)
  const [error, setError] = useState<string | null>(null)

  const validate = () => {
    // Telegram 用户名：5-32字符，字母数字和下划线，允许带或不带 @
    const pattern = /^@?[a-zA-Z0-9_]{5,32}$/
    if (!pattern.test(username)) {
      setError("Please enter a valid Telegram username (5–32 letters, digits, or underscore)")
      return false
    }
    if (!Number.isFinite(amount) || amount < 1) {
      setError("Amount must be a positive integer of at least 1")
      return false
    }
    setError(null)
    return true
  }

  const handleConfirm = () => {
    if (!validate()) return
    onConfirm?.({ username: username.startsWith("@") ? username : `@${username}`, amount })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="gift-props-title"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className={[
            "relative w-[317px] min-h-[280px] rounded-[12px]",
            "flex flex-col items-start p-4 gap-[12px]",
            "bg-[#0F172B]",
          ].join(" ")}
        >
          {/* 顶部关闭按钮 */}
          <button
            type="button"
            aria-label="Close"
            className="absolute right-3 top-3 w-6 h-6 rounded-full flex items-center justify-center text-white/80 hover:text-white"
            onClick={onCancel}
          >
            <img
              src="/backpack/gift_props/off.svg"
              width={10}
              height={10}
              alt="Close"
            />
          </button>

          {/* 标题区：图标 + 标题 + 描述 */}
          <div className="w-[285px] flex flex-col items-start">
            <div className="flex flex-row items-center p-0 gap-[8px] h-[30px]">
              <Image src="/backpack/gift_props/gift_props.svg" alt="Gift Props" width={16} height={16} />
              <h2 id="gift-props-title" className="text-white text-[16px] font-medium leading-[22px]">
                Gift Props
              </h2>
            </div>
            <p className="mt-2 text-[#E4E4E4] text-[14px] leading-[22px]">
              Enter your friend's Telegram username
            </p>
          </div>

          {/* 内容区 */}
          <div className="w-[285px] flex flex-col gap-[10px]">
            {/* 用户名输入 */}
            <div className="flex flex-col gap-[4px] w-[285px] h-[68px]">
              <label htmlFor="gift-username" className="text-white text-[14px] font-medium leading-[22px]">
                Gift Props
              </label>
              <div
                className="ui-input ui-input--dark flex flex-row items-center w-[285px] h-[42px] rounded-[12px] px-[10px]"
              >
                <span aria-hidden className="mx-2 w-px h-4" style={{ background: "rgba(228,228,228,0.6)" }} />
                <input
                  id="gift-username"
                  name="username"
                  type="text"
                  placeholder="@username"
                  aria-describedby="username-help"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-[#E4E4E4] text-[14px] font-medium placeholder:text-[#E4E4E4]"
                />
              </div>
              <span id="username-help" className="sr-only">Telegram username starting with @</span>
            </div>

            {/* 数量输入 */}
            <div className="flex flex-col gap-[4px] w-[285px] h-[68px]">
              <label htmlFor="gift-amount" className="text-white text-[14px] font-medium leading-[22px]">
                Amount
              </label>
              <div
                className="ui-input ui-input--dark flex flex-row items-center w-[285px] h-[42px] rounded-[12px] px-[10px]"
              >
                <input
                  id="gift-amount"
                  name="amount"
                  type="number"
                  min={1}
                  step={1}
                  value={amount}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="1"
                  onChange={(e) => {
                    const digitsOnly = e.target.value.replace(/\D+/g, "")
                    const next = digitsOnly === "" ? 0 : Number(digitsOnly)
                    setAmount(Math.max(1, next))
                  }}
                  className="w-[60px] bg-transparent outline-none text-[#E4E4E4] text-[14px] font-medium text-left"
                />
              </div>
            </div>
            {/* 操作区：取消 / 确认（位于底部一行） */}
            <div className="w-[287px] h-[30px] flex flex-row items-center p-0 gap-[8px] mt-2">
              <button
                type="button"
                className="flex flex-row justify-center items-center py-1 px-[10px] gap-[4px] w-[138px] h-[30px] bg-white rounded-[8px] text-black text-[14px] font-medium"
                onClick={onCancel}
              >
                cancel
              </button>
              <button
                type="button"
                className="ui-button flex flex-row justify-center items-center rounded-[8px] text-white text-[14px] font-medium"
                style={{ padding: "4px 10px", gap: "4px", width: "141px", height: "30px" }}
                onClick={handleConfirm}
              >
                Confirm Gift
              </button>
            </div>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="mt-1 text-[#E4E4E4] text-[12px]" role="alert">
              {error}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}