import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  ShieldCheck, 
  Zap, 
  Crown, 
  X, 
  AlertCircle, 
  RefreshCw, 
  ChevronLeft, 
  Globe,
  Lock,
  Sparkles,
  ChevronRight,
  Search
} from 'lucide-react';
import { VANITY_REQUIREMENTS } from '../constants';
import { VanityStyle } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (config: { chain: string; style: string; text?: string; prefix?: string; suffix?: string }) => void;
  userVolume: number;
}

const generateRandomVanity = (chain: string, digits: number = 4) => {
  const repeat = (c: string, n: number) => Array(n).fill(c).join('');
  
  const patterns = [
    { p: "888", scarcity: true },
    { p: "666", scarcity: false },
    { p: "ABAB", scarcity: false },
    { p: "000", scarcity: false },
    { p: "777", scarcity: true },
    { p: "8888", scarcity: true },
    { p: "ABCD", scarcity: false },
    { p: "1234", scarcity: false },
    { p: "6666", scarcity: true },
    { p: "0000", scarcity: true }
  ];
  
  const selected = patterns[Math.floor(Math.random() * patterns.length)];
  const p = selected.p;
  
  if (chain === 'EVM') {
    return `0x${p}${repeat('0', Math.max(0, digits - p.length))}..${p}`;
  } else {
    return `${p}${repeat('x', Math.max(0, digits - p.length))}..${p}`;
  }
};

const VanityApplicationModal: React.FC<Props> = ({ isOpen, onClose, onConfirm, userVolume }) => {
  const [step, setStep] = useState(1);
  const [selectedChain, setSelectedChain] = useState<'Solana' | 'EVM'>('Solana');
  const [styleType, setStyleType] = useState<VanityStyle>(VanityStyle.SYSTEM_RECOMMENDED);
  
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [selectedPoolAddress, setSelectedPoolAddress] = useState('');
  const [dailyRefreshRemaining, setDailyRefreshRemaining] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');

  const [customPrefix, setCustomPrefix] = useState('');
  const [customSuffix, setCustomSuffix] = useState('');

  const chainRequirements = VANITY_REQUIREMENTS.filter(r => r.chain === selectedChain);
  const reachedRequirements = chainRequirements.filter(r => userVolume >= r.volume);
  const maxAllowedRequirement = reachedRequirements.length > 0 
    ? reachedRequirements[reachedRequirements.length - 1] 
    : null;

  useEffect(() => {
    if (isOpen) {
      const digits = maxAllowedRequirement?.digits || 3;
      const initial = Array.from({ length: 10 }, () => generateRandomVanity(selectedChain, digits));
      setRecommendations(initial);
      setSelectedPoolAddress(initial[0]);
    }
  }, [selectedChain, isOpen, maxAllowedRequirement]);

  const handleRefresh = () => {
    if (dailyRefreshRemaining <= 0) return;
    const digits = maxAllowedRequirement?.digits || 3;
    const newBatch = Array.from({ length: 10 }, () => generateRandomVanity(selectedChain, digits));
    setRecommendations(newBatch);
    setSelectedPoolAddress(newBatch[0]);
    setDailyRefreshRemaining(prev => prev - 1);
    setSearchQuery('');
  };

  if (!isOpen) return null;

  const handleNext = () => setStep(prev => Math.min(3, prev + 1));
  const handlePrev = () => setStep(prev => Math.max(1, prev - 1));

  const filteredRecommendations = recommendations.filter(addr => 
    addr.toUpperCase().includes(searchQuery.toUpperCase())
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      {/* Modal Root Container: background-color #141414, border 1px solid rgba(255, 255, 255, 0.12) */}
      <div className="bg-[#141414] border border-white/12 w-full max-w-[420px] rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header: Reverted to transparent background to not modify sub-component color */}
        <div className="px-4 py-3.5 border-b border-[#222] flex justify-between items-center bg-transparent">
          <div className="flex items-center gap-2">
            {step > 1 && (
              <button onClick={handlePrev} className="p-1 hover:bg-white/5 rounded transition-colors">
                <ChevronLeft className="w-4 h-4 text-gray-400" />
              </button>
            )}
            <div>
              <h2 className="text-md font-bold flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-[#f3ba2f]" />
                申请靓号钱包
              </h2>
              <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest leading-none mt-0.5">STEP {step} OF 3</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-full transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 h-[560px] overflow-y-auto">
          
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-3">
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">选择公链</h3>
                <div className="grid gap-3">
                  {(['Solana', 'EVM'] as const).map(chain => (
                    <button
                      key={chain}
                      onClick={() => setSelectedChain(chain)}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all font-black uppercase tracking-wider ${
                        selectedChain === chain 
                        ? 'bg-transparent border-[#f3ba2f] text-white shadow-lg' 
                        : 'bg-transparent border-white/5 text-gray-500 hover:text-white hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedChain === chain ? 'bg-[#f3ba2f] text-black' : 'bg-white/5 text-gray-500'}`}>
                          {chain === 'Solana' ? <Zap className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                        </div>
                        <span className="text-sm">{chain === 'Solana' ? 'Solana' : 'EVM (ETH/BSC/BASE)'}</span>
                      </div>
                      {/* CheckCircle removed per request for selection state */}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex gap-3">
                <Sparkles className="w-5 h-5 text-[#f3ba2f] shrink-0" />
                <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
                  选择您希望申请靓号的公链，后续步骤将为您生成对应格式的靓号地址。
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-3">
                <h3 className="text-[9px] font-black text-gray-500 uppercase tracking-widest">选择靓号样式</h3>
                
                <div className="relative bg-black/40 border border-white/10 rounded-2xl p-1 flex h-[52px] w-full overflow-hidden shadow-inner mb-4">
                  <div 
                    className={`absolute top-1 bottom-1 w-[calc(50%-2px)] bg-[#f3ba2f] rounded-xl transition-all duration-300 ease-out z-0 ${
                      styleType === VanityStyle.SYSTEM_RECOMMENDED ? 'left-1' : 'left-[calc(50%+1px)]'
                    }`}
                  />
                  
                  <button
                    onClick={() => setStyleType(VanityStyle.SYSTEM_RECOMMENDED)}
                    className={`flex-1 flex flex-col justify-center items-center text-center relative z-10 transition-colors duration-300 px-2 py-2 ${
                      styleType === VanityStyle.SYSTEM_RECOMMENDED ? 'text-black' : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    <div className="font-black text-[11px] mb-1">系统推荐池</div>
                    <div className={`text-[9px] font-bold leading-none ${styleType === VanityStyle.SYSTEM_RECOMMENDED ? 'text-gray-700' : 'text-gray-600'}`}>
                      当前等级为vip3，可选4位数靓号
                    </div>
                  </button>

                  <button
                    onClick={() => setStyleType(VanityStyle.CUSTOM)}
                    className={`flex-1 flex flex-col justify-center items-center text-center relative z-10 transition-colors duration-300 px-2 py-2 ${
                      styleType === VanityStyle.CUSTOM ? 'text-black' : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    <div className="font-black text-[11px] mb-1">自定义输入</div>
                    <div className={`text-[9px] font-bold leading-none ${styleType === VanityStyle.CUSTOM ? 'text-gray-700' : 'text-gray-600'}`}>
                      当前等级为 vip3，可自定义3位数靓号。
                    </div>
                  </button>
                </div>

                {styleType === VanityStyle.SYSTEM_RECOMMENDED ? (
                  <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                      <input 
                        type="text"
                        placeholder="在当前列表中搜索..."
                        className="w-full bg-transparent border border-white/5 rounded-lg pl-9 pr-3 py-3 text-[10px] font-bold text-gray-200 outline-none focus:border-[#f3ba2f]/50 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      {filteredRecommendations.map((addr, idx) => (
                        <div 
                          key={idx}
                          onClick={() => setSelectedPoolAddress(addr)}
                          className={`px-2.5 py-1 rounded-lg border cursor-pointer transition-all mono text-[10px] flex items-center justify-between group h-[32px] ${
                            selectedPoolAddress === addr 
                            ? 'border-[#f3ba2f] bg-transparent text-[#f3ba2f]' 
                            : 'border-white/5 bg-transparent text-gray-400 hover:border-white/10'
                          }`}
                        >
                          <span className="font-bold tracking-tighter truncate mr-1.5">{addr}</span>
                          <div className="flex items-center gap-1 shrink-0">
                             <span className="px-1 py-0.5 rounded text-[7px] font-black uppercase whitespace-nowrap border bg-transparent border-white/5 text-gray-500">
                               {maxAllowedRequirement?.digits || 4}位靓号
                             </span>
                          </div>
                        </div>
                      ))}
                      {filteredRecommendations.length === 0 && (
                        <div className="col-span-2 py-8 text-center text-gray-600 text-[11px] font-bold">未找到匹配的靓号</div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-transparent border border-white/5 rounded-2xl p-5 flex flex-col items-center gap-4 relative overflow-hidden">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
                        <Crown className="w-24 h-24" />
                      </div>
                      
                      <div className="flex items-center justify-center gap-4 w-full relative z-10">
                        <div className="flex flex-col items-center gap-1.5">
                           <div className="bg-black w-24 py-3 rounded-lg border border-white/5 flex items-center justify-center">
                              <input 
                                type="text" 
                                maxLength={maxAllowedRequirement?.digits || 4}
                                placeholder="前缀"
                                value={customPrefix}
                                onChange={(e) => setCustomPrefix(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                                className="bg-transparent text-center mono text-sm font-black text-gray-200 outline-none w-full uppercase"
                              />
                           </div>
                           <span className="text-[9px] font-black text-gray-600 uppercase">前缀</span>
                        </div>
                        
                        <div className="text-gray-700 font-black italic text-lg mb-4">...</div>

                        <div className="flex flex-col items-center gap-1.5">
                           <div className="bg-black w-24 py-3 rounded-lg border border-white/5 flex items-center justify-center">
                              <input 
                                type="text" 
                                maxLength={4}
                                placeholder="后缀"
                                value={customSuffix}
                                onChange={(e) => setCustomSuffix(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                                className="bg-transparent text-center mono text-sm font-black text-gray-200 outline-none w-full uppercase"
                              />
                           </div>
                           <span className="text-[9px] font-black text-gray-600 uppercase">后缀</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-2 relative z-10">
                        <div className="px-5 py-2 rounded-full bg-black/40 border border-[#f3ba2f]/40 flex items-center gap-2">
                          <span className="text-[11px] text-[#f3ba2f] font-black mono italic tracking-wider">
                            {customPrefix || '____'}...{customSuffix || '____'}
                          </span>
                          <CheckCircle className="w-3.5 h-3.5 text-[#f3ba2f]" strokeWidth={3} />
                        </div>
                        <div className="text-[8px] font-black text-gray-500 bg-black/40 px-3 py-1 rounded-full border border-white/5 uppercase tracking-widest">
                          预计 15MIN 生成
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-black border border-[#f3ba2f]/30 rounded-xl flex gap-3 shadow-[0_0_20px_rgba(243,186,47,0.08)]">
                       <AlertCircle className="w-5 h-5 text-[#f3ba2f] shrink-0 mt-0.5" />
                       <div className="space-y-2">
                        <p className="text-[11px] text-gray-100 font-bold leading-snug">建议前缀/后缀各输入 3-4 位，位数越多，后台计算生成时间越长。</p>
                        <p className="text-[11px] text-gray-400 font-bold leading-snug">当前支持 {maxAllowedRequirement?.digits || 4} 位自定义匹配，更长位数需升级您的 VIP 等级</p>
                       </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="pt-4">
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-[#f3ba2f]/20 rounded-xl p-6 relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="w-10 h-10 rounded-lg bg-[#f3ba2f] flex items-center justify-center shadow-lg shrink-0">
                      <ShieldCheck className="w-6 h-6 text-black" />
                     </div>
                     <div>
                      <div className="text-[9px] text-[#f3ba2f] font-black uppercase tracking-widest leading-none mb-1">Safety Hub</div>
                      <div className="font-black text-sm text-white italic tracking-tighter">平台安全托管权益</div>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                    {[
                      { title: '返佣 +15%', desc: '极速结算' },
                      { title: '百万理赔', desc: '官方承保' },
                      { title: 'VIP 标识', desc: '全生态同步' },
                      { title: 'MEV 专线', desc: '极速交易' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex gap-2.5 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#f3ba2f] shrink-0 mt-1.5" />
                        <div>
                          <div className="text-[11px] font-black text-gray-100 leading-none">{item.title}</div>
                          <div className="text-[9px] text-gray-500 font-bold mt-1.5 leading-none">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex gap-3">
                <AlertCircle className="w-5 h-5 text-[#f3ba2f] shrink-0 mt-0.5" />
                <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
                  托管服务为您的靓号钱包提供多重安全保障。请注意，导出私钥后，该钱包将脱离平台安全体系，相关权益将不再有效。
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer: Reverted to transparent background to not modify sub-component color */}
        <div className="px-4 py-3 border-t border-[#222] bg-transparent flex gap-2.5">
          <button 
            onClick={step === 1 ? onClose : handlePrev} 
            className="flex-1 px-3 py-3 rounded-lg bg-white/5 border border-white/10 font-black text-gray-400 hover:bg-white/10 transition-all text-[11px] uppercase tracking-wider"
          >
            {step === 1 ? '取消' : '返回'}
          </button>

          {step < 3 ? (
            <button 
              onClick={handleNext} 
              className="flex-[1.5] px-3 py-3 rounded-lg bg-[#f3ba2f] text-black font-black flex items-center justify-center gap-1.5 transition-all uppercase text-[11px] tracking-wider shadow-lg shadow-[#f3ba2f]/10"
            >
              下一步 <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button 
              onClick={() => onConfirm({ chain: selectedChain, style: styleType, text: styleType === VanityStyle.SYSTEM_RECOMMENDED ? selectedPoolAddress : undefined, prefix: styleType === VanityStyle.CUSTOM ? customPrefix : undefined, suffix: styleType === VanityStyle.CUSTOM ? customSuffix : undefined })}
              className="flex-[1.5] px-3 py-3 rounded-lg bg-[#f3ba2f] text-black font-black hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 uppercase text-[11px] tracking-wider shadow-lg shadow-[#f3ba2f]/10"
            >
              <ShieldCheck className="w-4 h-4" strokeWidth={3} /> 开启托管
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VanityApplicationModal;