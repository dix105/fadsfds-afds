document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mobile Menu Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('header nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.textContent = nav.classList.contains('active') ? '✕' : '☰';
        });

        // Close menu when link is clicked
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                menuToggle.textContent = '☰';
            });
        });
    }

    // --- Scroll Animations ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .stagger-children');
    animatedElements.forEach(el => observer.observe(el));

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) otherItem.classList.remove('active');
            });
            // Toggle current
            item.classList.toggle('active');
        });
    });

    // --- Playground Logic ---
    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('file-input');
    const previewImage = document.getElementById('preview-image');
    const generateBtn = document.getElementById('generate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const resultContainer = document.getElementById('result-container');
    const resultImage = document.getElementById('result-image');
    const resultPlaceholder = document.getElementById('result-placeholder');
    const loadingState = document.getElementById('loading-state');
    const downloadBtn = document.getElementById('download-btn');
    const uploadPlaceholder = document.querySelector('.upload-placeholder');

    // Handle File Select
    function handleFile(file) {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImage.src = e.target.result;
                previewImage.classList.remove('hidden');
                uploadPlaceholder.classList.add('hidden');
                generateBtn.disabled = false;
                uploadZone.style.borderStyle = 'solid';
            };
            reader.readAsDataURL(file);
        }
    }

    // Drag & Drop
    uploadZone.addEventListener('click', () => fileInput.click());
    
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = 'var(--primary)';
        uploadZone.style.backgroundColor = 'rgba(0, 240, 255, 0.1)';
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.style.borderColor = '';
        uploadZone.style.backgroundColor = '';
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = '';
        uploadZone.style.backgroundColor = '';
        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFile(e.target.files[0]);
        }
    });

    // Reset
    resetBtn.addEventListener('click', () => {
        fileInput.value = '';
        previewImage.src = '';
        previewImage.classList.add('hidden');
        uploadPlaceholder.classList.remove('hidden');
        generateBtn.disabled = true;
        uploadZone.style.borderStyle = 'dashed';
        
        // Reset result
        resultImage.src = '';
        resultImage.classList.add('hidden');
        resultPlaceholder.classList.remove('hidden');
        downloadBtn.disabled = true;
    });

    // Generate Simulation
    generateBtn.addEventListener('click', () => {
        if (!previewImage.src) return;

        // UI States
        generateBtn.disabled = true;
        loadingState.classList.remove('hidden');
        
        // Simulate Processing (3 seconds)
        setTimeout(() => {
            loadingState.classList.add('hidden');
            resultPlaceholder.classList.add('hidden');
            
            // For demo: Use the uploaded image as result (since we don't have backend)
            // In a real app, this would be the URL from the API
            resultImage.src = previewImage.src; 
            resultImage.classList.remove('hidden');
            
            downloadBtn.disabled = false;
            generateBtn.disabled = false;
            
            // Optional: Scroll to result on mobile
            if (window.innerWidth < 768) {
                resultContainer.scrollIntoView({ behavior: 'smooth' });
            }
        }, 3000);
    });

    // Download Function
    downloadBtn.addEventListener('click', async () => {
        if (!resultImage.src) return;
        
        try {
            const response = await fetch(resultImage.src);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = blobUrl;
            a.download = 'fooocus-ai-result.png';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(blobUrl);
            document.body.removeChild(a);
        } catch (e) {
            console.error('Download failed:', e);
            // Fallback
            const a = document.createElement('a');
            a.href = resultImage.src;
            a.download = 'result.png';
            a.target = '_blank';
            a.click();
        }
    });

    // --- Modals ---
    const modals = document.querySelectorAll('.modal');
    const modalTriggers = document.querySelectorAll('[data-modal-target]');
    const modalClosers = document.querySelectorAll('[data-modal-close]');

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = trigger.getAttribute('data-modal-target');
            const modal = document.getElementById(targetId);
            if (modal) modal.classList.add('active');
        });
    });

    modalClosers.forEach(closer => {
        closer.addEventListener('click', () => {
            const targetId = closer.getAttribute('data-modal-close');
            const modal = document.getElementById(targetId);
            if (modal) modal.classList.remove('active');
        });
    });

    // Close on click outside
    window.addEventListener('click', (e) => {
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
});