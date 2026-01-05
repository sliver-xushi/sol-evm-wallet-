import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, Globe, ChevronDown, Settings, User, 
  Plus, Download, Copy, Key, ArrowRightLeft, 
  ArrowUpRight, ArrowDownLeft, Shuffle, 
  Shield, AlertTriangle, Lock, Eye, EyeOff, 
  Crown, Info, Sparkles, Wallet as WalletIcon,
  Loader2, CheckCircle2
} from 'lucide-react';
import { INITIAL_WALLETS, MOCK_ASSETS } from './constants';
import { Wallet, Asset, UserStatus, VanityStyle } from './types';
import VanityApplicationModal from './components/VanityApplicationModal';

const DogShieldAvatar = ({ size = "w-6 h-6" }: { size?: string }) => (
  <div className={`${size} shrink-0 relative flex items-center justify-center`}>
    <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* Shield Background */}
      <path 
        d="M50 5 L90 20 V50 C90 75 73 92 50 98 C27 92 10 75 10 50 V20 L50 5Z" 
        fill="#28c77d" 
      />
      {/* Dog Silhouette */}
      <path 
        d="M48.5 28.5C48.5 28.5 54.5 35.5 57.5 38.5C60.5 41.5 70.5 44.5 72.5 45.5C74.5 46.5 74.5 50.5 71.5 52.5C68.5 54.5 61.5 53.5 58.5 58.5C55.5 63.5 57.5 70.5 55.5 75.5C53.5 80.5 45.5 85.5 41.5 79.5C37.5 73.5 31.5 60.5 30.5 55.5C29.5 50.5 36.5 41.5 41.5 35.5C46.5 29.5 48.5 23.5 51.5 22.5C52.5 22.5 50.5 25.5 48.5 28.5Z" 
        fill="black" 
      />
    </svg>
  </div>
);

const App: React.FC = () => {
  const [wallets, setWallets] = useState<Wallet[]>(INITIAL_WALLETS);
  const [selectedWalletId, setSelectedWalletId] = useState<string>('w1');
  const [showBalance, setShowBalance] = useState(true);
  const [isVanityModalOpen, setIsVanityModalOpen] = useState(false);
  const [showGenerateMenu, setShowGenerateMenu] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<'generating' | 'success' | null>(null);
  const generateMenuRef = useRef<HTMLDivElement>(null);

  const [userStatus, setUserStatus] = useState<UserStatus>({
    tradingVolume: 1280000, // $1.28M
    unlockedVanityLevel: 6
  });

  const activeWallet = wallets.find(w => w.id === selectedWalletId) || wallets[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (generateMenuRef.current && !generateMenuRef.current.contains(event.target as Node)) {
        setShowGenerateMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCreateOrdinaryWallet = () => {
    const newId = `w-${Date.now()}`;
    const newAddress = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const newWallet: Wallet = {
      id: newId,
      address: newAddress,
      balance: '0.000',
      source: 'Debot',
    };
    setWallets(prev => [newWallet, ...prev]);
    setSelectedWalletId(newId);
    setShowGenerateMenu(false);
  };

  const handleApplyVanity = (config: any) => {
    setIsVanityModalOpen(false);
    setShowGenerateMenu(false);
    setGenerationStatus('generating');

    setTimeout(() => {
      const newId = `vw-${Date.now()}`;
      let finalAddress = '';
      let displayAddress = '';

      if (config.prefix || config.suffix) {
        const prefix = config.prefix || '1234';
        const suffix = config.suffix || '1234';
        finalAddress = `${prefix}${Math.random().toString(36).substring(7).toUpperCase()}${suffix}`;
        displayAddress = `${prefix}..${suffix}`;
      } else {
        const raw = config.text || '666x..666';
        finalAddress = raw;
        displayAddress = raw.includes('..') ? raw : `${raw.slice(0, 4)}..${raw.slice(-4)}`;
      }

      const newVanityWallet: Wallet = {
        id: newId,
        address: finalAddress,
        displayAddress: displayAddress,
        balance: '0.000',
        source: 'Debot',
        isVanity: true,
        isCustodied: true,
      };
      
      setWallets(prev => [newVanityWallet, ...prev]);
      setSelectedWalletId(newId);
      setGenerationStatus('success');

      setTimeout(() => {
        setGenerationStatus(null);
      }, 1500);
    }, 2500);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0d0d0d]">
      <header className="h-14 border-b border-[#222] flex items-center justify-between px-4 bg-[#0d0d0d] z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 text-[#f3ba2f]">
            <div className="w-8 h-8 bg-[#f3ba2f] rounded flex items-center justify-center">
              <span className="text-black font-black text-xl italic">D</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Debot</span>
          </div>
          <nav className="flex items-center gap-6 text-sm font-medium text-gray-400">
            {['自选', 'AI 信号', '扫链', '行情', '掘金', '监控', '跟单'].map(item => (
              <span key={item} className="hover:text-white cursor-pointer transition-colors">{item}</span>
            ))}
            <span className="text-[#f3ba2f] relative">
              资产
              <div className="absolute -bottom-[18px] left-0 right-0 h-0.5 bg-[#f3ba2f]" />
            </span>
            <span className="hover:text-white cursor-pointer transition-colors">AI 交易员</span>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#f3ba2f]" />
            <input 
              className="bg-white/5 border border-transparent focus:border-[#f3ba2f]/50 hover:bg-white/10 rounded-lg pl-9 pr-4 py-1.5 text-xs w-64 outline-none transition-all"
              placeholder="搜索代币/钱包"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-600 bg-white/5 px-1 rounded">⌘K</div>
          </div>
          
          <button className="bg-[#f3ba2f]/10 text-[#f3ba2f] px-3 py-1.5 rounded-lg text-xs font-bold border border-[#f3ba2f]/20 hover:bg-[#f3ba2f]/20 transition-all flex items-center gap-2">
            <Download className="w-3.5 h-3.5" />
            App 下载
          </button>

          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
            <Globe className="w-4 h-4 text-[#7b3fe4]" />
            <span className="text-xs font-medium">Solana</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
          </div>

          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
            <Shuffle className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs font-bold mono">0.011</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
          </div>

          <div className="flex items-center gap-3 ml-2">
            <Settings className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white transition-colors" />
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-500 flex items-center justify-center cursor-pointer border border-white/10 hover:border-white/30 transition-all">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        <aside className="w-[420px] border-r border-[#222] flex flex-col bg-[#0d0d0d]">
          <div className="p-4 border-b border-[#222]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold whitespace-nowrap text-gray-300">Solana 钱包 ({wallets.length})</span>
                <div className="flex items-center gap-2 text-[10px] text-gray-500">
                  <span className="cursor-pointer hover:text-gray-300">已归档</span>
                  <span className="cursor-pointer hover:text-gray-300">操作记录</span>
                  <button 
                    onClick={() => setIsVanityModalOpen(true)}
                    className="text-[#f3ba2f] font-bold hover:underline underline-offset-2 flex items-center gap-0.5"
                  >
                    靓号申请
                    <ArrowUpRight className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
              <div className="flex gap-1.5 shrink-0 relative" ref={generateMenuRef}>
                <button className="bg-white/5 hover:bg-white/10 px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-colors border border-white/5 text-gray-300">
                  <Download className="w-3 h-3" rotate={180} />
                  导入
                </button>
                
                <button 
                  onClick={() => setShowGenerateMenu(!showGenerateMenu)}
                  className="bg-[#f3ba2f] text-black hover:bg-[#e2ac2b] px-3 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-colors shadow-lg shadow-[#f3ba2f]/10"
                >
                  <Plus className="w-3 h-3" strokeWidth={3} />
                  生产钱包
                </button>

                {showGenerateMenu && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-2xl z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <button 
                      onClick={handleCreateOrdinaryWallet}
                      className="w-full p-3 flex items-start gap-3 hover:bg-white/5 transition-colors text-left border-b border-[#222]"
                    >
                      <div className="mt-0.5 w-6 h-6 rounded bg-gray-800 flex items-center justify-center shrink-0">
                        <WalletIcon className="w-3.5 h-3.5 text-gray-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-200">普通钱包</span>
                        <span className="text-[9px] text-gray-500 leading-tight">随机生成地址 of the wallet</span>
                      </div>
                    </button>
                    <button 
                      onClick={() => {
                        setIsVanityModalOpen(true);
                        setShowGenerateMenu(false);
                      }}
                      className="w-full p-3 flex items-start gap-3 hover:bg-white/5 transition-colors text-left"
                    >
                      <div className="mt-0.5 w-6 h-6 rounded bg-[#f3ba2f]/10 flex items-center justify-center shrink-0">
                        <Crown className="w-3.5 h-3.5 text-[#f3ba2f]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#f3ba2f]">靓号钱包</span>
                        <span className="text-[9px] text-gray-500 leading-tight">可定制前后缀的特殊地址</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {generationStatus && (
              <div className={`mb-3 py-2 px-3 rounded-lg border flex items-center justify-center gap-2 transition-all duration-300 animate-in fade-in slide-in-from-top-1 ${
                generationStatus === 'generating' 
                ? 'bg-[#f3ba2f]/5 border-[#f3ba2f]/20' 
                : 'bg-green-500/5 border-green-500/20'
              }`}>
                {generationStatus === 'generating' ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 text-[#f3ba2f] animate-spin" />
                    <span className="text-[11px] font-bold text-gray-300">钱包正在生成中...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                    <span className="text-[11px] font-bold text-gray-100">生成完成</span>
                  </>
                )}
              </div>
            )}

            <div className="grid grid-cols-12 text-[10px] text-gray-500 font-medium px-2 mb-2 uppercase tracking-wider">
              <div className="col-span-1 flex items-center justify-center">
                <input type="checkbox" className="accent-[#f3ba2f]" />
              </div>
              <div className="col-span-5">钱包</div>
              <div className="col-span-3">余额</div>
              <div className="col-span-2">来源</div>
              <div className="col-span-1 text-right">操作</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {wallets.map(wallet => (
              <div 
                key={wallet.id}
                onClick={() => setSelectedWalletId(wallet.id)}
                className={`grid grid-cols-12 py-3 px-4 items-center cursor-pointer transition-colors border-l-2 ${
                  selectedWalletId === wallet.id 
                  ? 'bg-[#f3ba2f]/5 border-[#f3ba2f]' 
                  : 'hover:bg-white/5 border-transparent'
                }`}
              >
                <div className="col-span-1 flex items-center justify-center">
                   <input 
                    type="checkbox" 
                    checked={selectedWalletId === wallet.id}
                    onChange={() => setSelectedWalletId(wallet.id)}
                    className="accent-[#f3ba2f]" 
                   />
                </div>
                <div className="col-span-5 flex items-center gap-2">
                   <div className="relative group/tooltip">
                     {wallet.isSafety ? (
                        <div className="w-6 h-6 rounded-full bg-yellow-600/20 flex items-center justify-center">
                          <Shield className="w-3.5 h-3.5 text-yellow-600" />
                        </div>
                     ) : wallet.isVanity ? (
                        <DogShieldAvatar />
                     ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400">
                           {wallet.address[0].toUpperCase()}
                        </div>
                     )}

                     {wallet.isVanity && (
                       <div className="invisible group-hover/tooltip:visible fixed ml-8 mt-[-32px] w-64 p-3 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.8)] z-[200] pointer-events-none animate-in fade-in slide-in-from-left-1 duration-200">
                         <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                              <DogShieldAvatar size="w-4 h-4" />
                              <span className="text-[11px] font-bold text-white leading-none">平台安全托管中</span>
                            </div>
                            <div className="text-[10px] text-gray-400 font-medium leading-tight">
                              导出私钥后将无法继续享受相关权益
                            </div>
                         </div>
                         <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-2.5 h-2.5 bg-[#1a1a1a] border-l border-b border-[#333] rotate-45" />
                       </div>
                     )}
                   </div>

                   <div className="flex flex-col overflow-hidden">
                      <div className="flex items-center gap-1">
                        <span className={`text-xs font-medium mono truncate ${wallet.isVanity ? 'text-[#f3ba2f]' : 'text-gray-200'}`}>
                          {wallet.isVanity 
                            ? (wallet.displayAddress || wallet.address.slice(0, 4) + '..' + wallet.address.slice(-4)) 
                            : wallet.address.length > 10 ? `${wallet.address.slice(0, 4)}..${wallet.address.slice(-4)}` : wallet.address
                          }
                        </span>
                        {wallet.isVanity && (
                          <span className="text-[8px] bg-[#f3ba2f]/10 text-[#f3ba2f] px-1 rounded leading-none py-0.5 font-black uppercase border border-[#f3ba2f]/20">靓号</span>
                        )}
                        <Copy className="w-3 h-3 text-gray-500 hover:text-white shrink-0" />
                        {wallet.labels?.includes('warning') && <AlertTriangle className="w-3 h-3 text-red-500 shrink-0" />}
                        {wallet.labels?.includes('lock') && <Lock className="w-3 h-3 text-gray-500 shrink-0" />}
                      </div>
                   </div>
                </div>
                <div className="col-span-3">
                   <div className="flex items-center gap-1.5">
                     <Globe className="w-3 h-3 text-[#7b3fe4]" />
                     <span className="text-xs font-bold mono">{wallet.balance}</span>
                   </div>
                </div>
                <div className="col-span-2">
                   <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-gray-400 border border-white/5 whitespace-nowrap">
                     {wallet.source}
                   </span>
                </div>
                <div className="col-span-1 flex justify-end gap-2 text-gray-500">
                   <Download className="w-3.5 h-3.5 hover:text-white" rotate={180} />
                   <Key className="w-3.5 h-3.5 hover:text-white" />
                   <Shuffle className="w-3.5 h-3.5 hover:text-white" />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-[#222] flex items-center justify-between text-[10px] text-gray-500">
            <div className="flex gap-4">
              <span className="cursor-pointer hover:text-white">邀请返佣</span>
              <span className="cursor-pointer hover:text-white">会员订阅</span>
              <span className="cursor-pointer hover:text-white">推特监控</span>
              <span className="cursor-pointer hover:text-white">自选</span>
              <span className="cursor-pointer hover:text-white">持仓</span>
            </div>
          </div>
        </aside>

        <section className="flex-1 overflow-hidden flex flex-col bg-[#0d0d0d] p-6">
          <div className="bg-[#141414] rounded-2xl p-6 border border-[#222] mb-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#f3ba2f]/5 blur-[80px] -mr-32 -mt-32 rounded-full" />
             
             <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                 已选 (1) 总余额
                 <button onClick={() => setShowBalance(!showBalance)} className="hover:text-white transition-colors">
                    {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                 </button>
               </div>
               <div className="flex gap-3">
                 <button className="bg-[#f3ba2f] text-black px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all">
                    <Plus className="w-4 h-4" strokeWidth={3} /> 充值
                 </button>
                 <button className="bg-white/5 hover:bg-white/10 px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border border-white/10 transition-all">
                    <ArrowUpRight className="w-4 h-4" /> 提现
                 </button>
                 <button className="bg-white/5 hover:bg-white/10 px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border border-white/10 transition-all">
                    <ArrowRightLeft className="w-4 h-4" /> 划转
                 </button>
                 <button className="bg-white/5 hover:bg-white/10 px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border border-white/10 transition-all">
                    <Shuffle className="w-4 h-4" /> 跨链
                 </button>
               </div>
             </div>

             <div className="flex items-baseline gap-2 mb-6">
               <span className="text-4xl font-black mono tracking-tighter">
                 {showBalance ? activeWallet.balance : '0 . 0 0 0'}
               </span>
               <span className="text-lg font-bold text-gray-500 uppercase tracking-widest">SOL</span>
               <span className="text-sm text-gray-500 font-medium ml-2">≈ $0.126</span>
             </div>

             <div className="grid grid-cols-4 gap-8">
               <div>
                 <div className="text-[10px] text-gray-500 mb-1 font-bold uppercase tracking-wider">总盈亏</div>
                 <div className="text-lg font-bold text-red-500">-$17.358 <span className="text-xs ml-1 font-medium">-2.45%</span></div>
               </div>
               <div>
                 <div className="text-[10px] text-gray-500 mb-1 font-bold uppercase tracking-wider">未实现利润</div>
                 <div className="text-lg font-bold text-red-500">-$240.22 <span className="text-xs ml-1 font-medium">-90.5%</span></div>
               </div>
               <div className="col-span-2 flex justify-end items-center gap-4">
                 {activeWallet.isCustodied && !activeWallet.isVanity && (
                    <div className="flex items-center gap-3 bg-green-500/5 px-4 py-2 rounded-xl border border-green-500/10">
                      <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <Shield className="w-4 h-4 text-green-500" />
                      </div>
                      <div className="text-[10px]">
                        <div className="text-green-500 font-black leading-none mb-1">平台安全托管</div>
                        <div className="text-gray-500 leading-none">导出私钥后权益失效</div>
                      </div>
                      <button className="text-[10px] text-gray-300 font-bold hover:text-white underline ml-2 transition-colors">导出私钥</button>
                    </div>
                 )}
               </div>
             </div>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col bg-[#141414] rounded-2xl border border-[#222]">
             <div className="px-6 border-b border-[#222] flex items-center justify-between">
                <div className="flex gap-8 text-sm font-bold">
                  {['持仓', '最近盈亏', '活动', '交易日志', '挂单'].map((tab, idx) => (
                    <div key={tab} className={`py-4 cursor-pointer relative ${idx === 0 ? 'text-[#f3ba2f]' : 'text-gray-400 hover:text-white transition-colors'}`}>
                      {tab}
                      {idx === 0 && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f3ba2f]" />}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="accent-[#f3ba2f]" /> 隐藏小额
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked className="accent-[#f3ba2f]" /> 只看主动
                  </div>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto">
               <table className="w-full text-left border-collapse">
                 <thead className="sticky top-0 bg-[#141414] z-10 border-b border-[#222]">
                   <tr className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                     <th className="px-6 py-4 font-bold">币种</th>
                     <th className="px-4 py-4 font-bold">未实现利润 <ArrowDownLeft className="inline w-3 h-3" /></th>
                     <th className="px-4 py-4 font-bold">已实现利润 <ArrowDownLeft className="inline w-3 h-3" /></th>
                     <th className="px-4 py-4 font-bold">总利润 <ArrowDownLeft className="inline w-3 h-3" /></th>
                     <th className="px-4 py-4 font-bold">余额 <ArrowDownLeft className="inline w-3 h-3" /></th>
                     <th className="px-4 py-4 font-bold">总买入 ⇅/平均</th>
                     <th className="px-4 py-4 font-bold">总卖出 ⇅/平均</th>
                     <th className="px-6 py-4 font-bold">交易数</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-[#222]">
                   {MOCK_ASSETS.map((asset, i) => (
                     <tr key={i} className="hover:bg-white/5 transition-colors group">
                       <td className="px-6 py-4">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center border border-white/5">
                              <span className="text-[10px] font-bold">{asset.symbol[0]}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-gray-200">{asset.name}</span>
                              <span className="text-[10px] text-gray-500 mono">{asset.symbol}</span>
                            </div>
                         </div>
                       </td>
                       <td className="px-4 py-4">
                         <div className="flex flex-col">
                           <span className="text-xs font-bold text-red-500">{asset.unrealizedPnL}</span>
                           <span className="text-[10px] text-red-500/70">{asset.unrealizedPnLPercent}</span>
                         </div>
                       </td>
                       <td className="px-4 py-4">
                         <div className="flex flex-col">
                           <span className="text-xs font-bold text-gray-400">{asset.realizedPnL}</span>
                           <span className="text-[10px] text-gray-500">{asset.realizedPnLPercent}</span>
                         </div>
                       </td>
                       <td className="px-4 py-4 text-xs font-bold text-red-500">{asset.totalProfit}</td>
                       <td className="px-4 py-4 text-xs font-bold mono">{asset.balance}</td>
                       <td className="px-4 py-4">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-400">{asset.avgBuy}</span>
                            <span className="text-[10px] text-gray-600 font-medium">{asset.avgBuy}</span>
                          </div>
                       </td>
                       <td className="px-4 py-4">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-400">{asset.avgSell}</span>
                            <span className="text-[10px] text-gray-600 font-medium">-</span>
                          </div>
                       </td>
                       <td className="px-6 py-4">
                         <div className="flex flex-col">
                           <span className="text-xs font-bold text-gray-300">{asset.trades}</span>
                           <span className="text-[10px] text-green-500/70 font-bold">{asset.winLoss}</span>
                         </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        </section>
      </main>

      <footer className="h-8 border-t border-[#222] bg-[#0d0d0d] flex items-center justify-between px-4 text-[10px] text-gray-500 font-medium">
        <div className="flex items-center gap-4">
           <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" /> 异常 | 29 FPS</span>
           <span className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors"><Info className="w-3 h-3" /> 在线客服</span>
           <span className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors"><Info className="w-3 h-3" /> 使用教程</span>
           <span className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors"><Info className="w-3 h-3" /> TG Bot</span>
           <span className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors"><Download className="w-3 h-3" /> APP 下载</span>
        </div>
        <div className="flex items-center gap-4">
           <span className="text-[#f3ba2f] font-bold">SOL: $125.79</span>
           <div className="flex gap-2">
             <ArrowRightLeft className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
             <Shuffle className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
           </div>
        </div>
      </footer>

      <VanityApplicationModal 
        isOpen={isVanityModalOpen}
        onClose={() => setIsVanityModalOpen(false)}
        onConfirm={handleApplyVanity}
        userVolume={userStatus.tradingVolume}
      />

      <div className="fixed bottom-10 right-10 z-[100]">
        <div className="relative group cursor-pointer">
           <button className="w-14 h-14 bg-[#f3ba2f] rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-[#f3ba2f]/20">
              <span className="text-2xl">🔔</span>
           </button>
           <div className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-[#0d0d0d] shadow-lg">
             2419
           </div>
        </div>
      </div>
    </div>
  );
};

export default App;