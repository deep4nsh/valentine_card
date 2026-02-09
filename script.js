document.addEventListener('DOMContentLoaded', () => {
    const noBtn = document.getElementById('noBtn');
    const yesBtn = document.getElementById('yesBtn');
    const question = document.querySelector('.question');
    const subText = document.querySelector('.sub-text');
    const mainGif = document.getElementById('mainGif');
    const glassCard = document.querySelector('.glass-card');

    // Create floating hearts background
    createFloatingHearts();

    // Logic for "No" button evasion
    let yesScale = 1;
    const moveNoBtn = () => {
        // Move to body if not already there to avoid stacking context issues with glass-card
        if (noBtn.parentNode !== document.body) {
            document.body.appendChild(noBtn);
        }

        // Get card dimensions
        const cardRect = glassCard.getBoundingClientRect();
        const btnWidth = noBtn.offsetWidth;
        const btnHeight = noBtn.offsetHeight;

        let newX, newY;
        let overlap = true;
        let attempts = 0;

        // Try to find a non-overlapping position
        while (overlap && attempts < 50) {
            newX = Math.random() * (window.innerWidth - btnWidth);
            newY = Math.random() * (window.innerHeight - btnHeight);

            // Check if this position overlaps with the card
            // We add a small buffer (20px) to make sure it doesn't touch the edges either
            if (
                newX + btnWidth + 20 > cardRect.left &&
                newX - 20 < cardRect.right &&
                newY + btnHeight + 20 > cardRect.top &&
                newY - 20 < cardRect.bottom
            ) {
                overlap = true;
            } else {
                overlap = false;
            }
            attempts++;
        }

        noBtn.style.position = 'fixed';
        noBtn.style.left = `${newX}px`;
        noBtn.style.top = `${newY}px`;

        // Add dynamic rotation for fun
        const rotation = (Math.random() * 30) - 15;
        noBtn.style.transform = `rotate(${rotation}deg)`;

        // Make Yes button grow to encourage clicking it
        yesScale += 0.1;
        yesBtn.style.transform = `scale(${yesScale})`;
    };

    noBtn.addEventListener('mouseover', moveNoBtn);
    noBtn.addEventListener('touchstart', moveNoBtn); // For mobile
    noBtn.addEventListener('click', moveNoBtn); // Just in case they click fast enough

    // Logic for "Yes" button
    yesBtn.addEventListener('click', () => {
        // Change content
        question.innerHTML = "Yay! I love you! ❤️";
        subText.innerHTML = "Best Valentine Ever!";
        // Change GIF to a happy one
        mainGif.src = "https://media.giphy.com/media/hz5LJiMnbTsGM/giphy.gif"; // Pusheen Happy

        // Remove buttons
        document.querySelector('.buttons').style.display = 'none';
        // Also remove noBtn in case it was moved to body
        noBtn.remove();

        // Add celebration effect (more hearts/confetti)
        celebrate();
    });

    function createFloatingHearts() {
        const container = document.querySelector('.floating-hearts');
        const heartCount = 20;

        for (let i = 0; i < heartCount; i++) {
            const heart = document.createElement('div');
            heart.classList.add('heart');
            heart.innerHTML = '❤️';
            heart.style.left = `${Math.random() * 100}%`;
            heart.style.animationDuration = `${Math.random() * 5 + 5}s`; // 5-10s
            heart.style.fontSize = `${Math.random() * 20 + 10}px`;
            container.appendChild(heart);
        }
    }

    function celebrate() {
        // Simple confetti-like effect using hearts
        const duration = 3000;
        const end = Date.now() + duration;

        (function frame() {
            // We can add a simple particle burst here if we want, 
            // but for now, let's just intensify the background hearts
            // or maybe just enjoy the happy gif state.
            // Let's create a burst of hearts from the center
            for (let i = 0; i < 5; i++) {
                createBurstHeart();
            }

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }

    function createBurstHeart() {
        const heart = document.createElement('div');
        heart.innerHTML = '💖';
        heart.style.position = 'fixed';
        heart.style.left = '50%';
        heart.style.top = '50%';
        heart.style.transform = 'translate(-50%, -50%)';
        heart.style.pointerEvents = 'none';
        heart.style.fontSize = '2rem';
        heart.style.zIndex = '100';
        document.body.appendChild(heart);

        const angle = Math.random() * Math.PI * 2;
        const velocity = 2 + Math.random() * 3;
        let dx = Math.cos(angle) * velocity;
        let dy = Math.sin(angle) * velocity;
        let opacity = 1;

        function animate() {
            const currentLeft = parseFloat(heart.style.left) || 50; // These are %, need pixels for precise physics but % is okay for simple burst
            // Actually, let's use pixels for top/left
            const rect = heart.getBoundingClientRect();

            heart.style.left = `${rect.left + dx}px`;
            heart.style.top = `${rect.top + dy}px`;
            opacity -= 0.02;
            heart.style.opacity = opacity;

            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                heart.remove();
            }
        }
        animate();
    }
});
