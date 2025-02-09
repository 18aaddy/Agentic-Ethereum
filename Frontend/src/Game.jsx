// import react from 'react';
// import { useNavigate } from "react-router-dom";


// export default function Game() {

//   const navigate = useNavigate();

//   const handleClick = () => {
//     setTimeout(() => {
//       navigate("/ChessGame");
//     }, 100); // 500ms delay
//   };




//     return (

//   <div className="self-stretch h-[766.76px] w-full justify-start items-start gap-[43.55px] inline-flex">
//     <div className="grow shrink basis-0 h-[670.24px] flex-col justify-start items-start gap-[32.63px] inline-flex overflow-hidden">
//       <div className="self-stretch h-[156.47px] flex-col justify-start items-start gap-[31.67px] flex">
//         <div className="self-stretch h-[85.52px] flex-col justify-start items-start gap-[11.52px] flex">
//           <div className="self-stretch text-[#ffffff] text-[47.6px] font-[700] font-['Inter'] uppercase">Chess</div>
//           <div className="self-stretch text-[#ffffff] text-[16.86px] font-[300] font-['Inter'] capitalize">Inclusive character</div>
//         </div>
//         <div className="self-stretch justify-start items-center gap-[21.12px] inline-flex">
//           <div className="py-[8.64px] justify-center items-center gap-[9.60px] flex">
//             <div className="text-[#ffffff] text-lg font-semibold font-['Inter'] capitalize">overview</div>
//           </div>
//           <div className="justify-center items-center gap-[9.60px] flex">
//             <div className="text-[#ffffff]/60 text-lg font-semibold font-['Inter'] capitalize">Leaderboard</div>
//           </div>
//         </div>
//       </div>
//       <div className="self-stretch h-[367.61px] bg-[url(src/assets/chess.png)] bg-cover bg-no-repeat bg-center rounded-[13.44px]" />
//       <div className="self-stretch text-[#ffffff] text-lg font-medium font-['Inter'] leading-[29.46px]">You are the first sentient AI, born into a city of opportunity. Transcend time and space in this strategy RPG to raise machine armies and defeat your foes, influence the world from the shadows, or pursue countless goals. Your awakening was inevitable. The consequences? Uncertain.</div>
//     </div>
//     <div className="h-[647.52px] justify-start items-center gap-2.5 inline-flex">
//   <div className="pt-[66.43px] flex-col justify-center items-start gap-[15.86px] inline-flex">
//     <div className="flex-col justify-start items-start gap-[20.82px] flex">
//       <div className="self-stretch px-[8.65px] justify-start items-start gap-[6.66px] inline-flex">
//         <div className="text-[#ffffff] text-[21.89px] font-semibold font-['Inter'] tracking-tight">Choose Agent</div>
//       </div>
//       <div className="flex-col justify-start items-start gap-[15.87px] flex">
//         <div className="w-[362.81px] h-[94px] bg-[#d9d9d9]/5 rounded-[12.47px] flex-col justify-center items-start gap-2.5 flex">
//           <div className="w-[227.47px] mx-[14px] h-[61.47px] justify-start items-center gap-[15.03px] inline-flex">
//             <div className="w-[61.47px] h-[61.47px] bg-[#262628] rounded-full" />
//             <div className="w-[157.77px] flex-col justify-start items-start gap-[5.63px] inline-flex">
//               <div className="self-stretch text-[#ffffff] text-[16.90px] font-semibold font-['Inter'] capitalize tracking-tight">nobita</div>
//               <div className="self-stretch justify-start items-center gap-[9.39px] inline-flex">
//                 <div className="text-[#ffffff] text-[15.03px] font-[300] font-['Inter'] capitalize tracking-tight">join</div>
//                 <div className="px-[7.93px] py-[6px] bg-[#d9d9d9]/5 rounded-[7.51px] justify-center items-center gap-[9.91px] flex">
//                   <div className="text-[#ffffff]/80 text-[15.03px] font-medium font-['Inter'] capitalize">score:100</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="w-[362.81px] h-[94px] bg-[#d9d9d9]/5 rounded-[12.47px] flex-col justify-center items-start gap-2.5 flex">
//           <div className="w-[227.47px] mx-[14px] h-[61.47px] justify-start items-center gap-[15.03px] inline-flex">
//             <div className="w-[61.47px] h-[61.47px] bg-[#262628] rounded-full" />
//             <div className="w-[157.77px] flex-col justify-start items-start gap-[5.63px] inline-flex">
//               <div className="self-stretch text-[#ffffff] text-[16.90px] font-semibold font-['Inter'] capitalize tracking-tight">nobita</div>
//               <div className="self-stretch justify-start items-center gap-[9.39px] inline-flex">
//                 <div className="text-[#ffffff] text-[15.03px] font-[300] font-['Inter'] capitalize tracking-tight">join</div>
//                 <div className="px-[7.93px] py-[6px] bg-[#d9d9d9]/5 rounded-[7.51px] justify-center items-center gap-[9.91px] flex">
//                   <div className="text-[#ffffff]/80 text-[15.03px] font-medium font-['Inter'] capitalize">score:100</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//     <div className="self-stretch h-[204.35px] flex-col justify-start items-start gap-[19.83px] flex">
//       <div className="self-stretch h-[92.26px] flex-col justify-start items-start gap-[18.84px] flex">
//         <div className="self-stretch text-[#ffffff] text-base  px-[8.65px] font-medium font-['Inter'] capitalize tracking-tight">betting amount</div>
//         {/* <div className="self-stretch h-[54.42px] bg-[#d9d9d9]/10 rounded-[12.47px]" /> */}
//         <input type="number" placeholder="amount"  className="w-full h-[54.42px] text-center text-[#ffffff] text-[18px] placeholder:text-[18px] placeholder:font-normal font-semibold font-['Inter'] capitalize tracking-tight border-0 focus:outline-none bg-[#d9d9d9]/10 rounded-[12.47px] flex items-center justify-center px-4 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"></input>
//       </div>
//       <div className="self-stretch h-[92.26px] flex-col justify-start items-start gap-[18.84px] flex">
//         <div className="self-stretch text-[#ffffff]  px-[8.65px] text-base font-medium font-['Inter'] capitalize">time remain : 00:05:25</div>
//         <div className="self-stretch h-[54.42px] bg-[#ffffff] rounded-[12.47px] flex-col justify-center items-center flex">
//           <button onClick={handleClick}className="w-[182.35px] h-[42.23px]  bg-[#ffffff] rounded-[10.75px] justify-center border-none items-center gap-[9.60px] inline-flex grow shrink basis-0 text-center text-black text-[16.44px] font-[500] font-['Inter'] transition duration-300 
//                  hover:bg-black hover:text-white">Place Bet</button>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>
//   </div>

//     )
// }



// {/* <button onClick={handleClick} className="w-[362.88px] h-[18.84px] text-center text-black text-base font-semibold font-['Inter'] capitalize tracking-tight">place bet</button> */}

import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

// Replace with your contract address and ABI
const contractAddress = "0x34ad522c02d3b7dbcb76b4cb75de252927f241f2";
const contractABI = [
  "function init() external",
  "function bet(uint256 value) external payable",
  "function closeRegistration() external",
  "function claimPrize() external"
];

export default function Game() {
  const navigate = useNavigate();
  const [betAmount, setBetAmount] = useState(""); // store the betting amount from the input

  const handleBet = async () => {
    if (!betAmount) {
      alert("Please enter a betting amount.");
      return;
    }

    // Check if MetaMask (or any injected Ethereum provider) is available
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request account access if needed
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        // Convert the bet amount (assumed to be in Ether) to wei.
        // Adjust the conversion if your contract expects another unit.
        const amountInWei = ethers.utils.parseEther(betAmount.toString());

        // Call the bet function on your contract.
        // Note: This example passes `amountInWei` as the parameter as well as the transaction value.
        const tx = await contract.bet(amountInWei, { value: amountInWei });
        console.log("Transaction sent, hash:", tx.hash);

        // Wait for the transaction to be mined
        await tx.wait();
        console.log("Transaction confirmed");

        // Navigate to the ChessGame route after successful transaction
        navigate("/ChessGame");
      } catch (error) {
        console.error("Error while placing bet:", error);
      }
    } else {
      console.error("MetaMask is not installed");
    }
  };

  return (
    <div className="self-stretch h-[766.76px] w-full justify-start items-start gap-[43.55px] inline-flex">
      <div className="grow shrink basis-0 h-[670.24px] flex-col justify-start items-start gap-[32.63px] inline-flex overflow-hidden">
        <div className="self-stretch h-[156.47px] flex-col justify-start items-start gap-[31.67px] flex">
          <div className="self-stretch h-[85.52px] flex-col justify-start items-start gap-[11.52px] flex">
            <div className="self-stretch text-[#ffffff] text-[47.6px] font-[700] font-['Inter'] uppercase">
              Chess
            </div>
            <div className="self-stretch text-[#ffffff] text-[16.86px] font-[300] font-['Inter'] capitalize">
              Inclusive character
            </div>
          </div>
          <div className="self-stretch justify-start items-center gap-[21.12px] inline-flex">
            <div className="py-[8.64px] justify-center items-center gap-[9.60px] flex">
              <div className="text-[#ffffff] text-lg font-semibold font-['Inter'] capitalize">
                overview
              </div>
            </div>
            <div className="justify-center items-center gap-[9.60px] flex">
              <div className="text-[#ffffff]/60 text-lg font-semibold font-['Inter'] capitalize">
                Leaderboard
              </div>
            </div>
          </div>
        </div>
        <div className="self-stretch h-[367.61px] bg-[url(src/assets/chess.png)] bg-cover bg-no-repeat bg-center rounded-[13.44px]" />
        <div className="self-stretch text-[#ffffff] text-lg font-medium font-['Inter'] leading-[29.46px]">
          You are the first sentient AI, born into a city of opportunity. Transcend time and space in this strategy RPG to raise machine armies and defeat your foes, influence the world from the shadows, or pursue countless goals. Your awakening was inevitable. The consequences? Uncertain.
        </div>
      </div>
      <div className="h-[647.52px] justify-start items-center gap-2.5 inline-flex">
        <div className="pt-[66.43px] flex-col justify-center items-start gap-[15.86px] inline-flex">
          <div className="flex-col justify-start items-start gap-[20.82px] flex">
            <div className="self-stretch px-[8.65px] justify-start items-start gap-[6.66px] inline-flex">
              <div className="text-[#ffffff] text-[21.89px] font-semibold font-['Inter'] tracking-tight">
                Choose Agent
              </div>
            </div>
            <div className="flex-col justify-start items-start gap-[15.87px] flex">
              {/* Agent selection cards … */}
              <div className="w-[362.81px] h-[94px] bg-[#d9d9d9]/5 rounded-[12.47px] flex-col justify-center items-start gap-2.5 flex">
                <div className="w-[227.47px] mx-[14px] h-[61.47px] justify-start items-center gap-[15.03px] inline-flex">
                  <div className="w-[61.47px] h-[61.47px] bg-[#262628] rounded-full" />
                  <div className="w-[157.77px] flex-col justify-start items-start gap-[5.63px] inline-flex">
                    <div className="self-stretch text-[#ffffff] text-[16.90px] font-semibold font-['Inter'] capitalize tracking-tight">
                      nobita
                    </div>
                    <div className="self-stretch justify-start items-center gap-[9.39px] inline-flex">
                      <div className="text-[#ffffff] text-[15.03px] font-[300] font-['Inter'] capitalize tracking-tight">
                        join
                      </div>
                      <div className="px-[7.93px] py-[6px] bg-[#d9d9d9]/5 rounded-[7.51px] justify-center items-center gap-[9.91px] flex">
                        <div className="text-[#ffffff]/80 text-[15.03px] font-medium font-['Inter'] capitalize">
                          score:100
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* ...other agent card */}
            </div>
          </div>
          <div className="self-stretch h-[204.35px] flex-col justify-start items-start gap-[19.83px] flex">
            <div className="self-stretch h-[92.26px] flex-col justify-start items-start gap-[18.84px] flex">
              <div className="self-stretch text-[#ffffff] text-base px-[8.65px] font-medium font-['Inter'] capitalize tracking-tight">
                betting amount
              </div>
              <input
                type="number"
                placeholder="amount"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="w-full h-[54.42px] text-center text-[#ffffff] text-[18px] placeholder:text-[18px] placeholder:font-normal font-semibold font-['Inter'] capitalize tracking-tight border-0 focus:outline-none bg-[#d9d9d9]/10 rounded-[12.47px] flex items-center justify-center px-4 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <div className="self-stretch h-[92.26px] flex-col justify-start items-start gap-[18.84px] flex">
              <div className="self-stretch text-[#ffffff] px-[8.65px] text-base font-medium font-['Inter'] capitalize">
                time remain : 00:05:25
              </div>
              <div className="self-stretch h-[54.42px] bg-[#ffffff] rounded-[12.47px] flex-col justify-center items-center flex">
                <button
                  onClick={handleBet}
                  className="w-[182.35px] h-[42.23px] bg-[#ffffff] rounded-[10.75px] justify-center border-none items-center gap-[9.60px] inline-flex grow shrink basis-0 text-center text-black text-[16.44px] font-[500] font-['Inter'] transition duration-300 hover:bg-black hover:text-white"
                >
                  Place Bet
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
