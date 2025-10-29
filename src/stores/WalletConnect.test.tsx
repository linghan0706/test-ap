import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import WalletConnect from '../components/WalletConnect'
import * as useWalletStoreModule from './useWalletStore'

// 测试用例
jest.mock('./useWalletStore', () => ({
  useWalletStore: () => ({
    isConnected: false,
    address: null,
    balance: null,
    network: 'mainnet',
    connectWallet: jest.fn(),
    disconnectWallet: jest.fn(),
    updateBalance: jest.fn(),
    setNetwork: jest.fn(),
  }),
}))

describe('WalletConnect', () => {
  it('renders wallet connect button when not connected', () => {
    render(<WalletConnect />)

    expect(screen.getByText('钱包连接')).toBeInTheDocument()
    expect(screen.getByText('连接钱包')).toBeInTheDocument()
  })

  it('calls connectWallet when connect button is clicked', async () => {
    const mockConnectWallet = jest.fn()
    jest
      .mocked(useWalletStoreModule.useWalletStore)
      .mockReturnValue({
        isConnected: false,
        address: null,
        balance: null,
        network: 'mainnet',
        connectWallet: mockConnectWallet,
        disconnectWallet: jest.fn(),
        updateBalance: jest.fn(),
        setNetwork: jest.fn(),
      })

    render(<WalletConnect />)

    const connectButton = screen.getByText('连接钱包')
    fireEvent.click(connectButton)

    await waitFor(() => {
      expect(mockConnectWallet).toHaveBeenCalled()
    })
  })
})
