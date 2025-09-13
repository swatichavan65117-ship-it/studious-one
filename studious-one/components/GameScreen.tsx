

import React, { useState, useMemo, useEffect } from 'react';
import { Question } from '../types';
import HamsterIcon from './HamsterIcon';

interface GameScreenProps {
  questions: Question[];
  username: string;
  onRestart: () => void;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const HeartIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

const ShareIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z"/>
  </svg>
);


const GameScreen: React.FC<GameScreenProps> = ({ questions, username, onRestart }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | 'idle'>('idle');
  const [gameOver, setGameOver] = useState<'win' | 'lose' | null>(null);
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [showQr, setShowQr] = useState(false);

  const currentQuestion = questions[currentIndex];

  const shuffledOptions = useMemo(() => {
    if (!currentQuestion) return [];
    return shuffleArray(currentQuestion.options);
  }, [currentQuestion]);

  const handleAnswerClick = (option: string) => {
    if (feedback !== 'idle') return;

    const correct = option === currentQuestion.correctAnswer;

    if (correct) {
      setFeedback('correct');
      setScore(prev => prev + 100);
      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(prev => prev + 1);
          setFeedback('idle');
        } else {
          setCurrentIndex(prev => prev + 1); 
          setTimeout(() => setGameOver('win'), 1000);
        }
      }, 1200);
    } else {
      setFeedback('incorrect');
      setLives(prev => prev - 1);
      setTimeout(() => {
        if (lives - 1 <= 0) {
          setGameOver('lose');
        } else {
          setFeedback('idle');
        }
      }, 1200);
    }
  };
  
  const contraptionStages = useMemo(() => 
    [...questions, {question: 'Goal', options:[], correctAnswer: ''}].map((_, i) => {
        if (i === questions.length) return { type: 'goal' };
        const type = ['gate', 'bridge', 'fan'][i % 3];
        return { type };
    }), [questions.length]);

  const handleShare = async () => {
    const shareText = `I just scored ${score} in Study Rush! Can you beat my hamster's high score? 🐹🏁`;
    const shareData = {
      title: 'Study Rush Score!',
      text: shareText,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        setShareStatus('copied');
        setShowQr(true);
        setTimeout(() => setShareStatus('idle'), 2500);
      });
    }
  };

  if (gameOver) {
      const shareText = `I just scored ${score} in Study Rush! Can you beat my hamster's high score? 🐹🏁`;
      return (
          <div className="flex flex-col items-center justify-center min-h-screen p-4 text-white bg-cover bg-center"
            style={{backgroundImage: 'url(https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?q=80&w=1587&auto=format&fit=crop)'}}>
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
              <div className="relative w-full max-w-md p-8 space-y-4 bg-black/30 backdrop-blur-lg rounded-2xl shadow-2xl text-center border border-white/20">
                  <HamsterIcon 
                    className="w-28 h-28 mx-auto -mt-4 drop-shadow-[0_5px_15px_rgba(0,255,255,0.7)]" 
                    variant={gameOver === 'win' ? 'win' : 'lose'}
                  />
                  <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                    {gameOver === 'win' ? 'Course Complete!' : 'Run Failed!'}
                  </h1>
                  <p className="text-2xl text-slate-300">
                    {gameOver === 'win' ? `Amazing job, ${username}!` : `Better luck next time, ${username}!`}
                  </p>
                  <div className="py-4">
                      <p className="text-lg text-slate-400">Final Score</p>
                      <p className="text-6xl font-bold text-cyan-400">{score}</p>
                  </div>

                  {showQr && (
                    <div className="my-4 p-4 bg-black/30 rounded-lg border border-cyan-500/50 animate-fade-in">
                        <p className="text-sm text-cyan-300 mb-2">Scan with your phone to share!</p>
                        <div className="flex justify-center bg-white p-2 rounded-md">
                            <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=128x128&data=${encodeURIComponent(shareText)}`}
                                alt="QR Code for sharing score"
                                width="128"
                                height="128"
                            />
                        </div>
                        <button onClick={() => setShowQr(false)} className="mt-3 text-xs text-slate-400 hover:text-white underline">Close</button>
                    </div>
                  )}

                  <div className="mt-4 flex flex-col sm:flex-row gap-3 w-full">
                    <button
                        onClick={onRestart}
                        className="w-full px-6 py-3 text-xl font-bold text-white bg-cyan-500 rounded-lg hover:bg-cyan-600 focus:outline-none focus:ring-4 focus:ring-cyan-300 transform hover:scale-105 transition duration-300 shadow-lg shadow-cyan-500/20"
                    >
                        Play Another Quiz
                    </button>
                    <button
                        onClick={handleShare}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 text-lg font-bold text-cyan-200 bg-black/30 border-2 border-cyan-500 rounded-lg hover:bg-cyan-500/20 focus:outline-none focus:ring-4 focus:ring-cyan-300 transform hover:scale-105 transition duration-300"
                    >
                        <ShareIcon className="w-5 h-5" />
                        {shareStatus === 'idle' ? 'Share Score' : 'Copied!'}
                    </button>
                  </div>
              </div>
          </div>
      );
  }

  if (!currentQuestion) {
    return <div className="text-center p-8 text-white">Loading course...</div>
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-0 bg-cover bg-center text-white overflow-hidden"
        style={{backgroundImage: 'url(https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?q=80&w=1587&auto=format&fit=crop)'}}>
      <div className="absolute inset-0 bg-black/50"></div>
      {/* HUD */}
      <header className="relative w-full flex justify-between items-center p-4 bg-black/30 backdrop-blur-md z-20 border-b border-white/10">
        <div className="text-lg">
          <div>Score: <span className="text-cyan-300 font-bold">{score}</span></div>
          <div className="text-sm text-slate-300">{username}</div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">{lives}</span>
          <HeartIcon className="w-6 h-6 text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.7)]" />
        </div>
      </header>
      
      {/* Contraption View */}
      <div className="w-full h-64 flex-shrink-0 flex items-center relative">
        <div className="relative w-full h-32" style={{ transform: `translateX(calc(50% - ${currentIndex * 10}rem - 5rem))` }}>
          {contraptionStages.map((stage, i) => {
            const isSolved = i < currentIndex;
            const isActive = i === currentIndex;
            return (
              <div key={i} className="absolute top-0 h-full transition-all duration-500" style={{ left: `${i * 10}rem`, width: '10rem' }}>
                {/* Track */}
                <div className={`absolute bottom-0 h-2 bg-cyan-500/30 shadow-[0_0_10px] shadow-cyan-500/50 ${stage.type === 'bridge' && !isSolved ? 'w-1/4' : 'w-full'}`}></div>
                {stage.type === 'bridge' && <div className={`absolute bottom-0 right-0 h-2 bg-cyan-500/30 shadow-[0_0_10px] shadow-cyan-500/50 w-1/4`}></div>}
                {stage.type === 'bridge' && isSolved && <div className="absolute bottom-0 left-1/4 h-2 w-1/2 bg-cyan-400 shadow-[0_0_15px] shadow-cyan-400 animate-pulse"></div>}

                {/* Obstacle */}
                {stage.type === 'gate' && (
                  <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 w-3 h-16 bg-pink-500 shadow-[0_0_15px] shadow-pink-500 transition-transform duration-500 ${isSolved ? '-translate-y-16 opacity-0' : 'translate-y-0 opacity-100'}`}></div>
                )}
                {stage.type === 'fan' && isSolved && (
                   <svg xmlns="http://www.w3.org/2000/svg" className="absolute bottom-2 left-1/4 w-8 h-8 text-cyan-400 animate-spin drop-shadow-[0_0_10px_rgba(0,255,255,0.7)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v0a8 8 0 000 16v0a8 8 0 000-16v0z" /><path d="M12 4v0a8 8 0 010 16v0a8 8 0 010-16v0z" transform="rotate(45 12 12)"/></svg>
                )}
                {stage.type === 'goal' && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center">
                     <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.7)]" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    <p className="text-sm font-bold text-yellow-400">GOAL</p>
                  </div>
                )}
              </div>
            );
          })}
          {/* Runner */}
          <div className="absolute bottom-[0.5rem] transition-transform duration-1000" style={{ transform: `translateX(${currentIndex * 10}rem)` }}>
            <HamsterIcon className="w-16 h-16 drop-shadow-[0_0_20px_rgba(34,211,238,0.9)] animate-bobbing" />
          </div>
        </div>
      </div>
      
      {/* Question and Answers */}
      <div className="relative w-full max-w-6xl p-6 bg-black/30 backdrop-blur-lg rounded-t-2xl border-t border-white/20">
          <div className="text-center mb-4">
            <p className="text-sm font-semibold text-slate-400 mb-1">Question {currentIndex + 1} of {questions.length}</p>
            <h2 className="text-xl md:text-2xl font-bold leading-tight">{currentQuestion.question}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {shuffledOptions.map((option, index) => {
                  const isCorrectAnswer = option === currentQuestion.correctAnswer;
                  
                  return (
                      <button
                          key={index}
                          onClick={() => handleAnswerClick(option)}
                          disabled={feedback !== 'idle'}
                          className={`p-4 rounded-lg text-lg font-semibold border-2 transition-all duration-300 disabled:cursor-not-allowed
                            ${feedback === 'idle' && 'bg-black/20 border-slate-500 hover:bg-cyan-500/20 hover:border-cyan-400'}
                            ${feedback === 'correct' && (isCorrectAnswer ? 'bg-green-500/70 border-green-400 scale-105 shadow-[0_0_20px_rgba(74,222,128,0.5)]' : 'bg-black/20 border-slate-700 opacity-50')}
                            ${feedback === 'incorrect' && (isCorrectAnswer ? 'bg-red-500/70 border-red-400 scale-105 shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'bg-black/20 border-slate-700 opacity-50')}
                          `}
                      >
                          {option}
                      </button>
                  );
              })}
          </div>
           <div className="text-center h-6 mt-4 text-xl font-bold">
              {feedback === 'correct' && <p className="text-green-400 animate-pulse">+100 SCORE!</p>}
              {feedback === 'incorrect' && <p className="text-red-400">INCORRECT!</p>}
          </div>
      </div>
    </div>
  );
};

export default GameScreen;