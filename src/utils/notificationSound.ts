export const createNotificationSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Tạo oscillator cho âm thanh chính
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Tạo oscillator cho âm thanh phụ
    const oscillator2 = audioContext.createOscillator();
    const gainNode2 = audioContext.createGain();
    
    // Kết nối các node
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator2.connect(gainNode2);
    gainNode2.connect(audioContext.destination);
    
    // Thiết lập âm thanh chính
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // La5
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    
    // Thiết lập âm thanh phụ
    oscillator2.type = 'sine';
    oscillator2.frequency.setValueAtTime(1108.73, audioContext.currentTime); // Do#6
    gainNode2.gain.setValueAtTime(0.1, audioContext.currentTime);
    
    // Bắt đầu phát âm thanh
    oscillator.start();
    oscillator2.start();
    
    // Tạo hiệu ứng fade out
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    // Dừng âm thanh sau 0.5 giây
    oscillator.stop(audioContext.currentTime + 0.5);
    oscillator2.stop(audioContext.currentTime + 0.5);
}; 