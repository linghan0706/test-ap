import Avatar from 'antd/es/avatar/Avatar'
import { AntDesignOutlined } from '@ant-design/icons'















const powerIcon = (
  <svg
    width="12"
    height="20"
    viewBox="0 0 12 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.634 8.1124H7.11638C7.10563 8.1124 7.10563 8.1124 7.10563 8.1014V0.374909C7.10563 -0.0103149 6.61084 -0.142392 6.42799 0.1878L0.0496114 11.3373C-0.0902181 11.5904 0.0818799 11.8986 0.361539 11.8986H4.87911C4.88986 11.8986 4.88986 11.8986 4.88986 11.9096L4.88986 19.6251C4.88986 20.0103 5.38465 20.1424 5.5675 19.8122L11.9459 8.66272C12.0965 8.42058 11.9136 8.1124 11.634 8.1124Z"
      fill="#FDC700"
    />
  </svg>
)
const tonIcon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.96161 0C7.7019 0 9.92321 2.22131 9.92321 4.96161C9.92321 6.15289 9.50321 7.24643 8.80338 8.10156L8.09734 7.39527C8.63883 6.69972 8.93223 5.84309 8.93089 4.96161C8.93089 2.76932 7.15389 0.992321 4.96161 0.992321C2.76932 0.992321 0.992321 2.76932 0.992321 4.96161C0.992321 7.15389 2.76932 8.93089 4.96161 8.93089C5.84309 8.93223 6.69972 8.63883 7.39527 8.09734L8.10156 8.80338C7.21624 9.52913 6.10638 9.92495 4.96161 9.92321C2.22131 9.92321 0 7.7019 0 4.96161C0 2.22131 2.22131 0 4.96161 0ZM4.96161 2.85664L7.06657 4.96161L4.96161 7.06657L2.85664 4.96161L4.96161 2.85664ZM4.96161 4.25979L4.25954 4.96136L4.96161 5.66318L5.66318 4.96136L4.96136 4.25979H4.96161Z"
      fill="#00D3F3"
    />
    <path
      d="M14.7178 11.2076C14.0086 13.8545 11.288 15.4252 8.64109 14.716C7.4904 14.4076 6.54283 13.7189 5.89797 12.8216L6.76292 12.3224C7.29463 13.0255 8.04613 13.5306 8.89793 13.7575C11.0155 14.3249 13.1919 13.0683 13.7593 10.9508C14.3267 8.83317 13.0702 6.65679 10.9526 6.08939C8.83499 5.52198 6.65862 6.77851 6.09122 8.8961C5.86177 9.7472 5.92347 10.6506 6.26648 11.4626L5.40171 11.9621C4.92982 10.9191 4.83474 9.74458 5.13271 8.63927C5.84195 5.99234 8.56249 4.42164 11.2094 5.13088C13.8563 5.84012 15.427 8.56066 14.7178 11.2076ZM11.9585 10.4682L9.38045 11.9567L7.89202 9.37862L10.4701 7.89019L11.9585 10.4682ZM10.6032 10.1051L10.1072 9.24534L9.24759 9.74184L9.74391 10.6012L10.6032 10.1048L10.6032 10.1051Z"
      fill="#00D3F3"
    />
  </svg>
)


export default function UserHeader() {
  return (
    <header className="w-full bg-transparent px-4 py-3 sm:px-6 sm:py-4  backdrop-blur-xs">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* 左侧：头像和用户信息 */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink">
          <Avatar
            size={{ xs: 48, sm: 56, md: 64, lg: 72 }}
            icon={<AntDesignOutlined />}
            className="flex-shrink-0 border-2 border-purple-500"
          />
          <div className="min-w-0 flex-shrink">
            <div className="text-white font-bold text-base sm:text-lg md:text-xl truncate">
              Alen
            </div>
            <div className="text-gray-300 text-xs sm:text-sm md:text-base truncate">
              0x7..f44e
            </div>
          </div>
        </div>

        {/* 右侧：能量和代币显示 */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* 能量值 */}
          <div className="bg-[#694A15] backdrop-blur-sm rounded-[56px] px-3 py-1.5 sm:px-4 sm:py-2 flex items-center gap-1.5 sm:gap-2">
            <span>{powerIcon}</span>
            <span className="text-white font-bold text-sm sm:text-base md:text-lg whitespace-nowrap">
              8,547
            </span>
          </div>

          {/* 代币数 */}
          <div className="bg-[#133F7B] backdrop-blur-sm rounded-[56px] px-3 py-1.5 sm:px-4 sm:py-2 flex items-center gap-1.5 sm:gap-2">
            <span>{tonIcon}</span>
            <span className="text-white font-bold text-sm sm:text-base md:text-lg whitespace-nowrap">
              320
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
