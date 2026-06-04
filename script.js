        // --- Modal Logic ---
        function openProjectModal(element) {
            const modal = document.getElementById('project-modal');
            const backdrop = document.getElementById('modal-backdrop');

            // Extract data from clicked element
            const titleEl = element.querySelector('.project-title');
            const categoryEl = element.querySelector('.project-category');
            const title = titleEl ? titleEl.innerText : '';

            if (titleEl) document.getElementById('modal-title').innerText = title;
            if (categoryEl) document.getElementById('modal-category').innerText = categoryEl.innerText;

            // Content Elements
            const videoContainer = document.getElementById('modal-video-container');
            const galleryEl = document.getElementById('modal-gallery');
            const descBrief = document.getElementById('modal-desc-brief');
            const descExecution = document.getElementById('modal-desc-execution');

            // --- HELPER: Setup Video with Audio Toggle ---
            function setupHeroVideo(src, isPortrait = false) {
                // 1. Container Style
                videoContainer.style.display = 'block';
                if (isPortrait) {
                    videoContainer.className = "w-full aspect-[9/16] max-w-sm mx-auto bg-black mb-12 relative overflow-hidden group border border-theme transition-all duration-300";
                } else {
                    videoContainer.className = "w-full aspect-video bg-black mb-12 relative overflow-hidden group border border-theme transition-all duration-300";
                }

                // 2. HTML Content (Video + Brand Logo + Hover Controls)
                videoContainer.classList.add('pickd-video');
                videoContainer.innerHTML = `
                    <video class="hero-video w-full h-full object-cover" autoplay loop muted playsinline>
                        <source src="${src}" type="video/mp4">
                    </video>

                    <!-- Brand watermark (bottom-left) -->
                    <img src="plogo.png" alt="PICKD" class="hero-logo">

                    <!-- Minimal hover controls -->
                    <div class="hero-controls">
                        <button type="button" class="hc-btn hc-play hoverable" aria-label="Play / Pause">
                            <svg class="hc-ic-pause" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"></rect><rect x="14" y="5" width="4" height="14" rx="1"></rect></svg>
                            <svg class="hc-ic-play hidden" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>
                        </button>
                        <input type="range" class="hc-seek hoverable" min="0" max="100" value="0" step="0.1" aria-label="Seek">
                        <span class="hc-time">0:00</span>
                        <button type="button" class="hc-btn hc-mute hoverable" aria-label="Mute / Unmute">
                            <svg class="hc-ic-muted" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4z"></path><line x1="22" y1="9" x2="16" y2="15"></line><line x1="16" y1="9" x2="22" y2="15"></line></svg>
                            <svg class="hc-ic-sound hidden" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4z"></path><path d="M15.5 8.5a5 5 0 0 1 0 7"></path><path d="M18.5 6a9 9 0 0 1 0 12"></path></svg>
                        </button>
                        <button type="button" class="hc-btn hc-full hoverable" aria-label="Fullscreen">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"></path><path d="M16 3h3a2 2 0 0 1 2 2v3"></path><path d="M21 16v3a2 2 0 0 1-2 2h-3"></path><path d="M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
                        </button>
                    </div>
                `;

                // 3. Player Logic (play/pause, seek, mute, fullscreen)
                const video = videoContainer.querySelector('.hero-video');
                const playBtn = videoContainer.querySelector('.hc-play');
                const icPlay = videoContainer.querySelector('.hc-ic-play');
                const icPause = videoContainer.querySelector('.hc-ic-pause');
                const seek = videoContainer.querySelector('.hc-seek');
                const timeEl = videoContainer.querySelector('.hc-time');
                const muteBtn = videoContainer.querySelector('.hc-mute');
                const icMuted = videoContainer.querySelector('.hc-ic-muted');
                const icSound = videoContainer.querySelector('.hc-ic-sound');
                const fullBtn = videoContainer.querySelector('.hc-full');

                const fmtTime = (s) => {
                    if (!isFinite(s)) return '0:00';
                    const m = Math.floor(s / 60);
                    const sec = Math.floor(s % 60);
                    return m + ':' + (sec < 10 ? '0' : '') + sec;
                };
                const syncPlayIcon = () => {
                    if (!video) return;
                    if (video.paused) { icPlay.classList.remove('hidden'); icPause.classList.add('hidden'); }
                    else { icPlay.classList.add('hidden'); icPause.classList.remove('hidden'); }
                };
                const togglePlay = (e) => {
                    if (e) e.stopPropagation();
                    if (video.paused) { video.play(); } else { video.pause(); }
                };

                if (video) {
                    video.addEventListener('click', togglePlay);
                    if (playBtn) playBtn.addEventListener('click', togglePlay);
                    video.addEventListener('play', syncPlayIcon);
                    video.addEventListener('pause', syncPlayIcon);

                    video.addEventListener('timeupdate', () => {
                        if (video.duration) {
                            seek.value = (video.currentTime / video.duration) * 100;
                            timeEl.textContent = fmtTime(video.currentTime);
                        }
                    });
                    seek.addEventListener('input', (e) => {
                        e.stopPropagation();
                        if (video.duration) video.currentTime = (seek.value / 100) * video.duration;
                    });

                    if (muteBtn) {
                        muteBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            video.muted = !video.muted;
                            if (video.muted) { icMuted.classList.remove('hidden'); icSound.classList.add('hidden'); }
                            else { icSound.classList.remove('hidden'); icMuted.classList.add('hidden'); }
                        });
                    }
                    if (fullBtn) {
                        fullBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            const t = videoContainer;
                            if (document.fullscreenElement || document.webkitFullscreenElement) {
                                (document.exitFullscreen || document.webkitExitFullscreen).call(document);
                            } else if (t.requestFullscreen) { t.requestFullscreen(); }
                            else if (t.webkitRequestFullscreen) { t.webkitRequestFullscreen(); }
                        });
                    }
                    syncPlayIcon();
                }
            }

            // Clear existing gallery content
            galleryEl.innerHTML = '';

            // --- Custom Content Logic ---
            if (title.includes('DAILY DAISY')) {
                // DAILY DAISY: Portrait Video + 12 Images + Custom Text

                // 1. Setup Video with Sound (Portrait)
                setupHeroVideo("Daily daisy.mp4", true);

                // 2. Info Update
                // descBrief.innerText = "Redefining skincare for the modern minimalist. Daily Daisy isn't just about glowing skin; it's about glowing confidence. We stripped away the clinical jargon and replaced it with a voice that feels like a best friend.";
                descBrief.innerHTML = "Redefining skincare for the modern minimalist. Daily Daisy isn't just about glowing skin; it's about glowing confidence. We stripped away the clinical jargon and replaced it with a voice that feels like a best friend.<br><br><small>*This is just one of our case studies.</small>";
                descExecution.innerText = "The challenge was to stand out in a saturated market. We opted for a radical departure from the 'clean clinical' look, embracing raw, unfiltered textures and a vertical-first content strategy. The 12-piece visual campaign focuses on texture, touch, and the daily ritual of self-care, captured through intimate portraiture and macro videography.";

                // 3. 12 Visuals
                const dailyImages = [
                    // "Daily Daisy 1.png",
                    "Daily Daisy 2.webp",
                    "Daily Daisy 3.webp",
                    "Daily Daisy 4.webp",
                    //"Daily Daisy 5.png",//
                    "Daily Daisy 6.webp",
                    "Daily Daisy 7.webp",
                    "Daily Daisy 8.webp",
                    "Daily Daisy 9.webp",
                    "Daily Daisy 10.webp",
                    "Daily Daisy 11.webp",
                    "Daily Daisy 12.webp",
                    "daily daisy y.png"
                ];

                dailyImages.forEach(src => {
                    const img = document.createElement('img');
                    img.src = src;
                    img.className = "w-full h-auto object-cover transition-all duration-500 mb-4 rounded-sm";
                    galleryEl.appendChild(img);
                });

            } else if (title.includes('SAB MARINE')) {
                // SAB MARINE: NO Video + 12 Images + Custom Text

                // 1. Hide Video Container
                videoContainer.style.display = 'none';

                // 2. Info Update
                descBrief.innerText = "The ocean meets dining. SAB Marine required a brand identity that reflects the depth and mystery of the sea while inviting guests into a premium dining experience.";
                descExecution.innerText = "We built a visual identity inspired by undersea motion and surface simplicity. Using fluid layouts, deep-sea textures, and confident typography, we crafted a brand language that feels natural, immersive, and alive. The result stays grounded in real lighting, real feel, and real connection—no artificial shine, no visual clutter.";

                // 3. 12 Visuals
                const sabImages = [
                    "sab 1.webp",
                    "sab 2.webp",
                    "sab 3.webp",
                    "sab 4.webp",
                    "sab 5.webp",
                    "sab 6.webp",
                    "sab 7.webp",
                    "sab 8.webp",
                    "sab 9.webp",
                    "sab 10.webp",
                    "sab 11.webp",
                    "sab 12.webp"
                ];

                sabImages.forEach(src => {
                    const img = document.createElement('img');
                    img.src = src;
                    img.className = "w-full h-auto object-cover transition-all duration-500 mb-4 rounded-sm";
                    galleryEl.appendChild(img);
                });

            } else if (title.includes('SMART MEDIC')) {
                // SMART MEDIC: Landscape Image on Top (No Hero Video) + 4 Videos in Grid

                // 1. Override Video Container for Image
                videoContainer.style.display = 'block';
                videoContainer.className = "w-full aspect-video bg-black mb-12 relative overflow-hidden group border border-theme transition-all duration-300";
                videoContainer.innerHTML = `
                    <img src="smart_photo1.webp" class="w-full h-full object-cover opacity-90">
                    <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <h3 class="text-white text-xl uppercase tracking-[0.5em] mix-blend-overlay"></h3>
                    </div>

        

                `;

                // 2. Info Update
                descBrief.innerText = "Transform the patient experience. Smart Medic needed a brand identity that bridged the gap between sterile medical efficiency and human warmth. The goal: Trust through transparency.";
                descExecution.innerText = "We built a design system based on clarity and calm. Using a palette of reassuring teals and crisp whites, we developed an interface that simplifies complex health data. The visual language utilizes soft gradients and rounded geometry to make medical information accessible, not intimidating. The rebrand included a complete overhaul of their digital app interface and physical wayfinding systems.";

                // 3. 4 Videos in Grid
                const medicVideos = [
                    "smart vid1.mp4",
                    "smart vid 2.mp4",
                    "smart vid 3.mp4",
                    "smart vid 4.mp4"
                ];

                medicVideos.forEach(src => {
                    const vidWrapper = document.createElement('div');
                    vidWrapper.className = "w-full aspect-video relative overflow-hidden rounded-sm border border-theme bg-black";
                    vidWrapper.innerHTML = `
                        <video class="w-full h-full object-cover" autoplay loop muted playsinline>
                            <source src="${src}" type="video/mp4">
                        </video>
                    `;
                    galleryEl.appendChild(vidWrapper);
                });

            } else if (title.includes('UPANDUP.LIFE')) {
                // UPANDUP.LIFE: NO Video + 6 Images + Custom Text

                // 1. Hide Video Container
                videoContainer.style.display = 'none';

                // 2. Info Update
                descBrief.innerText = "Workforce intelligence built into digital clarity. UpandUp required a platform that transforms complex HR data into intuitive, actionable insights for enterprise leaders.";
                descExecution.innerText = "We stripped away the noise to focus on data legibility. The interface utilizes a high-contrast monochromatic palette with purposeful accent colors to highlight key metrics. We developed a custom iconography set and a modular grid system that allows the dashboard to scale seamlessly across devices, ensuring that workforce intelligence is always accessible.";

                // 3. 10 Visuals
                const upImages = [
                    "upandup 1.webp",
                    "upandup 2.webp",
                    "upandup 3.webp",
                    "upandup 4.webp",
                    "upandup 5.webp",
                    "upandup 6.webp",
                    "upandup 7.webp",
                    "upandup 8.webp",
                    "upandup 8.webp",
                ];

                upImages.forEach(src => {
                    const img = document.createElement('img');
                    img.src = src;
                    img.className = "w-full h-auto object-cover transition-all duration-500 mb-4 rounded-sm";
                    galleryEl.appendChild(img);
                });

            } else if (title.includes('LEARNIX')) {
                // LEARNIX: Landscape Video + 6 Images + Custom Text

                // 1. Setup Video with Sound (Landscape)
                setupHeroVideo("learnix video.mp4", false);

                // 2. Info Update
                descBrief.innerText = "Education is no longer static. Learnix required a brand system that moves at the speed of curiosity. We aimed to bridge the gap between gamified engagement and academic rigor, creating a platform that adapts to the learner's context.";
                descExecution.innerText = "We built a dual-mode interface: 'Focus Mode' for deep work (landscape) and 'Spark Mode' for quick, vertical consumption (portrait). The visual identity uses dynamic motion blur and kinetic type to represent the transfer of knowledge. The 6-part visual series highlights the seamless transition between these states, using a vibrant yet focused color palette.";

                // 3. 6 Visuals
                const learnixImages = [
                    "learnix 1.webp",
                    "learnix 2.webp",
                    "learnix 3.webp",
                    "learnix 4.webp",
                    "learnix 5.webp",
                    "learnix 6.webp"
                ];

                learnixImages.forEach(src => {
                    const img = document.createElement('img');
                    img.src = src;
                    img.className = "w-full h-auto object-cover transition-all duration-500 mb-4 rounded-sm";
                    galleryEl.appendChild(img);
                });

            } else if (title.includes('SMART CHAIR')) {
                // SMART CHAIR: Landscape Video + 4 Portrait Visuals + Custom Text

                // 1. Setup Video with Sound (Landscape)
                setupHeroVideo("chair video.mp4", false);

                // 2. Info Update
                descBrief.innerText = "The future of sitting is active. The Smart Chair isn't just furniture; it's a biomechanical interface. Our task was to create a visual identity for an AI-driven chair that adjusts to your posture in real-time.";
                descExecution.innerText = "We stepped away from the typical 'soft comfort' branding of furniture and leaned into precision engineering. The brand visual language uses wireframe meshes and heat-map gradients to visualize the chair's sensing capabilities. The 4-part visual series showcases the chair's sleek silhouette against brutalist architectural backdrops, emphasizing structure and form.";

                // 3. 4 Portrait Visuals
                const chairImages = [
                    "chair 1.webp",
                    "chair 2.webp",
                    "chair 3.webp",
                    "chair 4.webp"
                ];

                chairImages.forEach(src => {
                    const img = document.createElement('img');
                    img.src = src;
                    // Standard portrait display without special spans
                    img.className = "w-full aspect-[4/5] object-cover transition-all duration-500 mb-4 rounded-sm";
                    galleryEl.appendChild(img);
                });

            } else if (title.includes('NIVIA')) {
                // NIVIA: Landscape Video + 4 Images + Custom Text + Audio Toggle

                // 1. Setup Video with Sound (Landscape)
                setupHeroVideo("nivia video.mp4", false);

                // 2. Info Update
                // descBrief.innerText = "Revitalizing a legacy. Nivia needed to shed its static image and embrace a dynamic, motion-first identity that resonates with the modern athlete. The goal was to visualize energy.";
                descBrief.innerHTML = "Revitalizing a legacy. Nivia needed to shed its static image and embrace a dynamic, motion-first identity that resonates with the modern athlete. The goal was to visualize energy.<br><br><small>*This is just one of our case studies.</small>";
                descExecution.innerText = "We developed a kinetic visual system where typography and imagery are never still. Using high-frame-rate cinematography and data-moshing techniques, we created a brand language that feels fast, fluid, and unstoppable. The classic blue palette was electrified to stand out in digital feeds, creating a visual identity that sprints alongside the user.";

                // 3. 4 Visuals (Sports/Blue/Motion theme)
                const niviaImages = [
                    "nivia 1.webp",
                    "nivia 2.webp",
                    "nivia 3.webp",
                    "nivia 4.webp"
                ];

                niviaImages.forEach((src) => {
                    const img = document.createElement('img');
                    img.src = src;
                    // Standard grid layout for 4 items
                    img.className = "w-full h-auto object-cover transition-all duration-500 mb-4 rounded-sm";
                    galleryEl.appendChild(img);
                });

            } else if (title.includes('THE CANTEEN')) {
                // THE CANTEEN: NO Video + 7 Images + Custom Text

                // 1. Hide Video Container
                videoContainer.style.display = 'none';

                // 2. Info Update
                descBrief.innerText = "Revive the spirit of the college canteen. The Canteen isn't just a place to eat; it's a memory machine. We needed to bottle that specific feeling of shared meals, cheap coffee, and endless conversations into a cohesive brand identity.";
                descExecution.innerText = "We leaned hard into 'academic retro'. The typography borrows from vintage university yearbooks, paired with a warm, sepia-toned color palette. The menu design mimics old exam papers, and the environmental graphics feature hand-drawn doodles reminiscent of desk etchings. It's nostalgia, but graded on a curve.";

                // 3. 7 Visuals (Retro/Food/Social theme)
                const canteenImages = [
                    "cant 13.webp", // Main retro vibe
                    "cant 2.webp", // Burger/Food
                    "cant 12.webp", // Burger/Food
                    "cant 3.webp", // Cafe interior
                    "cant 1.webp", // Burger/Food
                    "cant 14.webp", // Burger/Food
                    "cant 15.webp", // Burger/Food
                    "cant 4.webp", // Menu/Branding
                    "cant 10.webp", // Menu/Branding
                    "cant 11.webp", // Social/People
                    "cant 5.webp", // Social/People
                    "cant 6.webp", // Restaurant vibe
                    //"cant 7.png"  // Packaging//
                    // "cant 16.png", // Burger/Food//
                ];

                canteenImages.forEach((src, index) => {
                    const img = document.createElement('img');
                    img.src = src;
                    // Make the 1st and 7th (last) image span 2 columns
                    const spanClass = (index === 0 || index === 6) ? 'md:col-span-2' : '';
                    img.className = `w-full h-auto object-cover transition-all duration-500 mb-4 rounded-sm ${spanClass}`;
                    galleryEl.appendChild(img);
                });

            } else if (title.includes('ANJANI GRAM')) {
                // ANJANI GRAM: NO Video + 6 Images + Custom Text

                // 1. Hide Video Container
                videoContainer.style.display = 'none';

                // 2. Info Update
                descBrief.innerText = "Capturing the eternal spirit of Kashi. Anjani Gram isn't just a destination; it's a pilgrimage. The task was to translate centuries of devotion into a visual identity that resonates with the modern seeker while respecting ancient traditions.";
                descExecution.innerText = "We adopted a 'documentary-style' approach to the brand visuals. Utilizing warm, golden-hour lighting and texture-rich photography, we crafted a narrative that feels timeless. The typography blends calligraphy with modern sans-serifs, creating a bridge between the old world and the new.";

                // 3. 6 Visuals
                const anjaniImages = [
                    "AGP 0.jpg",
                    "AGP 1.webp",
                    "AGP 2.webp",
                    "AGP 3.webp",
                    "AGP 4.webp",
                    "AGP 5.webp",
                    "AGP 6.webp",
                    "AGP 7.webp",
                    "AGP 8.webp",
                    "AGP 9.webp",
                ];

                anjaniImages.forEach((src, index) => {
                    const img = document.createElement('img');
                    img.src = src;
                    const spanClass = (index === 0 || index === 5) ? 'md:col-span-2' : '';
                    img.className = `w-full h-auto object-cover transition-all duration-500 mb-4 rounded-sm ${spanClass}`;
                    galleryEl.appendChild(img);
                });

            } else if (title.includes('SWAROVSKI')) {
                // SWAROVSKI: NO Video + 6 Images + Custom Text

                // 1. Hide Video Container
                videoContainer.style.display = 'none';

                // 2. Info Update
                // descBrief.innerText = "Crystal elegance captured in minimal frames. Swarovski needed a campaign that moved beyond tradition, embracing a sharp, modern aesthetic that highlights precision and brilliance.";
                descBrief.innerHTML = "Crystal elegance captured in minimal frames. Swarovski needed a campaign that moved beyond tradition, embracing a sharp, modern aesthetic that highlights precision and brilliance.<br><br><small>*This is just one of our case studies.</small>";
                descExecution.innerText = "We focused on light and refraction. The visual identity uses high-contrast photography and stark, minimal typography to let the product speak. The digital experience is built around discovery, with interactive galleries that allow users to explore the facets of every piece in detail.";

                // 3. 6 Images
                const swarVisuals = [
                    "swar 1.webp",
                    "swar 2.webp",
                    "swar 3.webp",
                    "swar 4.webp",
                    "swar 5.webp",
                    "swar 6.webp"
                ];

                swarVisuals.forEach((src) => {
                    const img = document.createElement('img');
                    img.src = src;
                    img.className = "w-full h-auto object-cover transition-all duration-500 mb-4 rounded-sm";
                    galleryEl.appendChild(img);
                });

            } else {
                // DEFAULT PROJECT: Landscape Video + 6 Images + Default Text

                // 1. Setup Video with Sound (Landscape)
                setupHeroVideo("https://videos.pexels.com/video-files/3163534/3163534-hd_1920_1080_30fps.mp4", false);

                // 2. Default Info
                descBrief.innerText = "Reinvent the digital presence for a future-tech conglomerate. The goal was to dismantle traditional corporate aesthetics and replace them with a raw, brutalist interface that screams innovation.";
                descExecution.innerText = "We approached this project with a 'mobile-first, motion-heavy' philosophy. Utilizing WebGL for fluid distortions and a custom physics engine for UI interactions, we created a site that feels alive. The visual language draws heavily from sci-fi telemetry and analog glitch art, resulting in a user experience that is both disorienting and captivating.";

                // 3. Default 6 Images
                const defaultImages = [
                    "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000",
                    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000",
                    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000",
                    "https://images.unsplash.com/photo-1558655146-d09347e0b7a9?q=80&w=2000",
                    "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2000",
                    "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000"
                ];

                defaultImages.forEach((src, index) => {
                    const img = document.createElement('img');
                    img.src = src;
                    // Apply special spanning for grid variety in default view
                    const spanClass = (index === 4 || index === 5) ? 'md:col-span-2' : '';
                    const marginClass = (index % 2 !== 0) ? 'mt-0 md:mt-12' : '';
                    img.className = `w-full h-auto object-cover transition-all duration-500 ${spanClass} ${marginClass} rounded-sm`;
                    galleryEl.appendChild(img);
                });
            }

            // Show
            modal.classList.remove('translate-y-full');
            backdrop.classList.remove('opacity-0', 'pointer-events-none');

            // Disable background scroll
            document.body.style.overflow = 'hidden';
        }

        function closeProjectModal() {
            const modal = document.getElementById('project-modal');
            const backdrop = document.getElementById('modal-backdrop');

            // --- NEW CODE: FIND AND STOP VIDEO ---
            // Look for any video inside the modal container
            const video = document.querySelector('#modal-video-container video');
            if (video) {
                video.pause();        // Stop the video/audio
                video.currentTime = 0; // Rewind to start
                video.muted = true;    // Mute it just in case
            }
            // -------------------------------------

            // Hide
            modal.classList.add('translate-y-full');
            backdrop.classList.add('opacity-0', 'pointer-events-none');

            // Enable background scroll
            document.body.style.overflow = '';
        }

        // --- Theme Toggle Logic ---
        function toggleTheme() {
            const html = document.documentElement;
            const current = html.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            try { localStorage.setItem('pickd-theme', next); } catch (e) {}

            // Update button text
            const btn = document.getElementById('themeBtn');
            if (btn) btn.innerText = `Mode: ${next.charAt(0).toUpperCase() + next.slice(1)}`;
        }

        // --- Router / Navigation Logic ---
        let currentView = 'home';

        function navigateTo(viewId, scrollTargetId = null) {
            const map = { home: 'index.html', work: 'work.html', services: 'services.html', about: 'about.html', contact: 'contact.html' };
            let url = map[viewId] || 'index.html';
            if (scrollTargetId) {
                if (viewId === 'home') url += '#' + scrollTargetId;
                else if (viewId === 'work') url += '#filter=' + scrollTargetId;
            }
            window.location.href = url;
            return false;
        }


        // --- Loader & Setup ---
        window.addEventListener('load', () => {
            // const loader = document.getElementById('loader');
            // loader.style.transform = 'translateY(-100%)';

            // Setup persistent interactions (EventListeners)
            setupWorkInteractions();

            // Initialize animations after load (only for the view present on this page)
            if (document.getElementById('view-home')) initHomeAnimations();
            if (document.getElementById('view-work')) {
                initWorkAnimations('all');
                var _fm = (location.hash.match(/filter=([\w-]+)/) || [])[1];
                if (_fm) { var _fb = document.querySelector('.work-filter-btn[data-filter="' + _fm + '"]'); if (_fb) _fb.click(); }
            }
            if (document.getElementById('view-services')) initServicesAnimations();
            if (document.getElementById('view-about')) initAboutAnimations();
            if (document.getElementById('view-contact')) initContactAnimations();

            // Sync theme button label + active nav with the current page
            (function () {
                var _t = document.documentElement.getAttribute('data-theme') || 'light';
                var _tb = document.getElementById('themeBtn');
                if (_tb) _tb.innerText = 'Mode: ' + _t.charAt(0).toUpperCase() + _t.slice(1);
                var _nav = { 'view-work': 'nav-work', 'view-services': 'nav-services', 'view-about': 'nav-about', 'view-contact': 'nav-contact' };
                for (var _v in _nav) { if (document.getElementById(_v)) { var _n = document.getElementById(_nav[_v]); if (_n) _n.classList.add('active'); } }
            })();

            // --- Custom Scrollbar Logic for #work-slider ---
            const slider = document.getElementById('work-slider');
            const thumb = document.getElementById('custom-slider-thumb');
            const track = document.getElementById('custom-slider-track');

            if (slider && thumb && track) {
                slider.addEventListener('scroll', () => {
                    const scrollPercentage = slider.scrollLeft / (slider.scrollWidth - slider.clientWidth);
                    const maxThumbLeft = track.clientWidth - thumb.clientWidth;
                    const thumbLeft = scrollPercentage * maxThumbLeft;
                    thumb.style.left = `${thumbLeft}px`;
                });

                let isDown = false;
                let startX;
                let scrollLeft;

                slider.addEventListener('mousedown', (e) => {
                    isDown = true;
                    slider.style.cursor = 'grabbing';
                    startX = e.pageX;
                    scrollLeft = slider.scrollLeft;
                });
                slider.addEventListener('mouseleave', () => {
                    isDown = false;
                    slider.style.cursor = 'grab';
                });
                slider.addEventListener('mouseup', () => {
                    isDown = false;
                    slider.style.cursor = 'grab';
                });
                slider.addEventListener('mousemove', (e) => {
                    if (!isDown) return;
                    e.preventDefault();
                    const x = e.pageX;
                    const walk = (x - startX) * 2;
                    slider.scrollLeft = scrollLeft - walk;
                });

                let isThumbDown = false;
                let thumbStartX;
                let thumbStartLeft;

                thumb.addEventListener('mousedown', (e) => {
                    isThumbDown = true;
                    thumbStartX = e.pageX;
                    const style = window.getComputedStyle(thumb);
                    thumbStartLeft = parseFloat(style.left);
                    thumb.style.cursor = 'grabbing';
                    e.stopPropagation();
                });

                document.addEventListener('mouseup', () => {
                    if (isThumbDown) {
                        isThumbDown = false;
                        thumb.style.cursor = 'grab';
                    }
                });

                document.addEventListener('mousemove', (e) => {
                    if (!isThumbDown) return;
                    e.preventDefault();
                    const deltaX = e.pageX - thumbStartX;
                    const maxThumbLeft = track.clientWidth - thumb.clientWidth;
                    let newLeft = thumbStartLeft + deltaX;
                    newLeft = Math.max(0, Math.min(newLeft, maxThumbLeft));
                    thumb.style.left = `${newLeft}px`;
                    const scrollPercentage = newLeft / maxThumbLeft;
                    slider.scrollLeft = scrollPercentage * (slider.scrollWidth - slider.clientWidth);
                });
            }

            // --- Drag Scroll Logic for Filters ---
            const filterContainer = document.getElementById('filter-scroll-container');
            if (filterContainer) {
                let isFilterDown = false;
                let filterStartX;
                let filterScrollLeft;

                filterContainer.addEventListener('mousedown', (e) => {
                    isFilterDown = true;
                    filterContainer.style.cursor = 'grabbing';
                    filterStartX = e.pageX - filterContainer.offsetLeft;
                    filterScrollLeft = filterContainer.scrollLeft;
                });
                filterContainer.addEventListener('mouseleave', () => {
                    isFilterDown = false;
                    filterContainer.style.cursor = 'grab';
                });
                filterContainer.addEventListener('mouseup', () => {
                    isFilterDown = false;
                    filterContainer.style.cursor = 'grab';
                });
                filterContainer.addEventListener('mousemove', (e) => {
                    if (!isFilterDown) return;
                    e.preventDefault();
                    const x = e.pageX - filterContainer.offsetLeft;
                    const walk = (x - filterStartX) * 2;
                    filterContainer.scrollLeft = filterScrollLeft - walk;
                });
            }

            // --- SPACE SHOOTER INIT ---
            initSpaceShooter();

            // --- CONTACT FORM LOGIC ---
            const cForm = document.getElementById('contact-form');
            if (cForm) {
                cForm.addEventListener('submit', function (e) {
                    e.preventDefault();

                    const name = document.getElementById('c-name').value.trim();
                    const email = document.getElementById('c-email').value.trim();
                    const message = document.getElementById('c-message').value.trim();

                    if (name && email && message) {
                        const subject = `New Inquiry from ${name}`;
                        const body = `Name: ${name}\nEmail: ${email}\n\nProject Details:\n${message}`;

                        // Use mailto to open default mail client
                        window.location.href = `mailto:info@pickd.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

                        // Optional: Reset form after brief delay
                        setTimeout(() => cForm.reset(), 1000);
                    }
                });
            }
        });

        // --- Mobile Menu ---
        const menuBtn = document.getElementById('menuBtn');
        const closeMenuBtn = document.getElementById('closeMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');

        function toggleMenu() {
            mobileMenu.classList.toggle('active');
        }

        menuBtn.addEventListener('click', toggleMenu);
        closeMenuBtn.addEventListener('click', toggleMenu);


        // --- Custom Cursor Logic ---
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorOutline = document.querySelector('.cursor-outline');

        document.body.addEventListener('mouseover', (e) => {
            const target = e.target.closest('.hoverable');
            if (target) {
                cursorOutline.classList.add('hovered');
                const type = target.getAttribute('data-cursor');
                if (type === 'view') {
                    cursorOutline.style.width = '100px';
                    cursorOutline.style.height = '100px';
                    cursorOutline.innerHTML = '<span class="flex items-center justify-center h-full text-black text-xs font-bold">VIEW</span>';
                } else if (type === 'big') {
                    cursorOutline.style.width = '60px';
                    cursorOutline.style.height = '60px';
                } else if (type === 'logo') {
                    // specific logo cursor? default hover is fine
                }
            }
        });

        document.body.addEventListener('mouseout', (e) => {
            const target = e.target.closest('.hoverable');
            if (target) {
                cursorOutline.classList.remove('hovered');
                cursorOutline.style.width = '';
                cursorOutline.style.height = '';
                cursorOutline.innerHTML = '';
            }
        });

        // Mouse Move
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // --- Animations Setup ---

        function initHomeAnimations() {
            gsap.registerPlugin(ScrollTrigger);
            // 4. Service Images (Home)
            const serviceItems = document.querySelectorAll('#view-home .service-item');
            serviceItems.forEach(item => {
                const img = item.querySelector('.service-img');
                const rotation = img.getAttribute('data-rotation') || 0;
                gsap.set(img, { xPercent: -50, yPercent: -50, rotate: rotation });
                item.addEventListener('mouseenter', () => {
                    if (window.innerWidth > 768) {
                        gsap.to(img, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" });
                    }
                });
                item.addEventListener('mousemove', (e) => {
                    if (window.innerWidth > 768) {
                        gsap.to(img, { x: e.clientX, y: e.clientY, duration: 0.5, ease: "power2.out" });
                    }
                });
                item.addEventListener('mouseleave', () => {
                    if (window.innerWidth > 768) {
                        gsap.to(img, { opacity: 0, scale: 0.8, duration: 0.3, ease: "power2.in" });
                    }
                });
            });

            // 2. About Section Animations (Home)
            const scrambleElements = document.querySelectorAll('#view-home .scramble-text');
            const randomChars = "!@#$%^&*()_+~|}{[]:;?><,./-=";

            scrambleElements.forEach(el => {
                const originalText = el.getAttribute('data-value');
                ScrollTrigger.create({
                    trigger: el,
                    start: "top 80%",
                    onEnter: () => {
                        let iteration = 0;
                        let interval = setInterval(() => {
                            el.innerText = originalText
                                .split("")
                                .map((letter, index) => {
                                    if (index < iteration) {
                                        return originalText[index];
                                    }
                                    return randomChars[Math.floor(Math.random() * 26)];
                                })
                                .join("");

                            if (iteration >= originalText.length) {
                                clearInterval(interval);
                            }

                            iteration += 1 / 3;
                        }, 30);
                    }
                });
            });

            gsap.utils.toArray('#view-home .reveal-paragraph').forEach((el, i) => {
                gsap.to(el, {
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%"
                    },
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    delay: i * 0.2,
                    ease: "power3.out"
                });
            });

            gsap.from("#view-home .stat-card", {
                scrollTrigger: {
                    trigger: "#view-home .stat-card",
                    start: "top 90%"
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "power2.out"
            });
        }

        // --- NEW: Work Page Interaction Setup (Run ONCE) ---
        function setupWorkInteractions() {
            // 1. Filter Logic
            const filters = document.querySelectorAll('.work-filter-btn');
            const items = document.querySelectorAll('.work-card');

            filters.forEach(btn => {
                btn.addEventListener('click', () => {
                    // Active state
                    filters.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    const filterValue = btn.getAttribute('data-filter');

                    //  // Animate Filtering
                    //  items.forEach(item => {
                    //      const category = item.getAttribute('data-category');

                    //      if(filterValue === 'all' || filterValue === category) {
                    //          // Show
                    //          gsap.to(item, {
                    //              opacity: 1,
                    //              scale: 1,
                    //              display: "block",
                    //              duration: 0.5,
                    //              ease: "power2.out"
                    //          });
                    //      } else {
                    //          // Hide
                    //          gsap.to(item, {
                    //              opacity: 0,
                    //              scale: 0.9,
                    //              display: "none",
                    //              duration: 0.3,
                    //              ease: "power2.in"
                    //          });
                    //      }
                    //  });


                    items.forEach(item => {
                        // Get categories and split by space into a list
                        const categories = item.getAttribute('data-category').split(' ');
                        const filterValue = btn.getAttribute('data-filter'); // Ensure we get the button's filter value

                        // Check if 'all' is selected OR if the list contains the filter value
                        if (filterValue === 'all' || categories.includes(filterValue)) {
                            // SHOW ITEM
                            gsap.to(item, {
                                opacity: 1,
                                scale: 1,
                                display: "block",
                                duration: 0.5,
                                ease: "power2.out"
                            });
                        } else {
                            // HIDE ITEM
                            gsap.to(item, {
                                opacity: 0,
                                scale: 0.9,
                                display: "none",
                                duration: 0.3,
                                ease: "power2.in"
                            });
                        }
                    });

                });
            });

            // 2. Floating Image Logic (Desktop)
            if (window.innerWidth > 768) {
                const previewContainer = document.getElementById('work-floating-preview');
                const previewImg = document.getElementById('work-preview-img');

                if (previewContainer) {
                    const xTo = gsap.quickTo(previewContainer, "left", { duration: 0.4, ease: "power3.out" });
                    const yTo = gsap.quickTo(previewContainer, "top", { duration: 0.4, ease: "power3.out" });

                    items.forEach(item => {
                        const imgChild = item.querySelector('img');
                        if (!imgChild) return;
                        const src = imgChild.src;

                        item.addEventListener('mouseenter', () => {
                            if (previewImg) previewImg.src = src;
                            gsap.to(previewContainer, { opacity: 1, scale: 1, duration: 0.3 });
                        });

                        item.addEventListener('mousemove', (e) => {
                            xTo(e.clientX);
                            yTo(e.clientY);
                        });

                        item.addEventListener('mouseleave', () => {
                            gsap.to(previewContainer, { opacity: 0, scale: 0.8, duration: 0.3 });
                        });
                    });
                }
            }
        }

        // --- Updated: Init Work Animations (Run on View Entry) ---
        function initWorkAnimations(filterCategory = 'all') {
            gsap.registerPlugin(ScrollTrigger);

            // 1. Set Initial Filter State without animation
            const filters = document.querySelectorAll('.work-filter-btn');
            const items = document.querySelectorAll('.work-card');

            // Update Active Button
            filters.forEach(b => {
                if (b.getAttribute('data-filter') === filterCategory) b.classList.add('active');
                else b.classList.remove('active');
            });

            //  // Update Items Visibility
            //  items.forEach(item => {
            //      const category = item.getAttribute('data-category');
            //      if(filterCategory === 'all' || filterCategory === category) {
            //          item.style.display = 'block';
            //          item.style.opacity = '1';
            //          item.style.transform = 'scale(1)';
            //      } else {
            //          item.style.display = 'none';
            //          item.style.opacity = '0';
            //      }
            //  });

            // Update Items Visibility
            items.forEach(item => {
                // Get the categories and split them into a list
                const categories = item.getAttribute('data-category').split(' ');

                if (filterCategory === 'all' || categories.includes(filterCategory)) {
                    item.style.display = 'block';
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                } else {
                    item.style.display = 'none';
                    item.style.opacity = '0';
                }
            });

            // 2. Animate VISIBLE items in
            const visibleItems = Array.from(items).filter(item => item.style.display !== 'none');

            gsap.fromTo(visibleItems,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out" }
            );
        }

        function initServicesAnimations() {
            gsap.registerPlugin(ScrollTrigger);
            gsap.from(".service-row", {
                scrollTrigger: {
                    trigger: ".service-row",
                    start: "top 90%"
                },
                x: -50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "power2.out"
            });
        }

        function initAboutAnimations() {
            gsap.registerPlugin(ScrollTrigger);

            const scrambleElements = document.querySelectorAll('#view-about .scramble-text');
            const randomChars = "!@#$%^&*()_+~|}{[]:;?><,./-=";

            scrambleElements.forEach(el => {
                const originalText = el.getAttribute('data-value');
                ScrollTrigger.create({
                    trigger: el,
                    start: "top 80%",
                    onEnter: () => {
                        let iteration = 0;
                        let interval = setInterval(() => {
                            el.innerText = originalText
                                .split("")
                                .map((letter, index) => {
                                    if (index < iteration) {
                                        return originalText[index];
                                    }
                                    return randomChars[Math.floor(Math.random() * 26)];
                                })
                                .join("");

                            if (iteration >= originalText.length) {
                                clearInterval(interval);
                            }

                            iteration += 1 / 3;
                        }, 30);
                    }
                });
            });

            gsap.utils.toArray('#view-about .reveal-paragraph').forEach((el, i) => {
                gsap.to(el, {
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%"
                    },
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    delay: i * 0.2,
                    ease: "power3.out"
                });
            });

            gsap.from("#view-about .stat-card", {
                scrollTrigger: {
                    trigger: ".stat-card",
                    start: "top 90%"
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "power2.out"
            });

            // Collective Cards Fix
            // 1. Clear any conflicting inline styles from previous navigations
            gsap.set(".collective-card", { clearProps: "all" });

            // 2. Use Batch for better handling of multiple grid items or standard fromTo with stagger
            ScrollTrigger.batch(".collective-card", {
                onEnter: batch => gsap.fromTo(batch,
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power2.out", overwrite: true }
                ),
                start: "top 85%"
            });
        }

        function initContactAnimations() {
            // Simple staggered reveal for the form fields
            gsap.from(".input-group", {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                delay: 0.3,
                ease: "power2.out"
            });
        }

        // --- Global Floating Elements Animation (Single Instance) ---
        const heroTitle = document.querySelector('h1');

        document.addEventListener('mousemove', (e) => {
            if (currentView === 'home') {
                const moveX = (e.clientX - window.innerWidth / 2) * 0.02;
                const moveY = (e.clientY - window.innerHeight / 2) * 0.02;

                const title = document.querySelector('#view-home h1');
                if (title) {
                    gsap.to(title, {
                        x: moveX,
                        y: moveY,
                        duration: 1
                    });
                }
            }
        });

        // --- SPACE SHOOTER GAME LOGIC ---
        function initSpaceShooter() {
            const canvas = document.getElementById('gameCanvas');
            const container = document.getElementById('playground');

            if (!canvas || !container) return;

            const ctx = canvas.getContext('2d');
            const scoreEl = document.getElementById('scoreEl');
            const speedSlider = document.getElementById('speedSlider');
            const speedVal = document.getElementById('speedVal');
            const winScreen = document.getElementById('win-screen');
            const continueBtn = document.getElementById('continue-btn');

            let width, height;
            let animationId;
            let score = 0;
            let frames = 0;
            let gameActive = false;
            let gameOver = false;
            let isPaused = false;
            let gameSpeed = 1.0;
            let hasWon = false;

            // Speed Slider
            if (speedSlider) {
                speedSlider.addEventListener('input', (e) => {
                    gameSpeed = parseFloat(e.target.value);
                    if (speedVal) speedVal.textContent = gameSpeed.toFixed(1);
                    e.target.blur();
                });
            }

            // Input State
            const keys = {
                w: false, a: false, s: false, d: false,
                ArrowUp: false, ArrowLeft: false, ArrowDown: false, ArrowRight: false,
                " ": false
            };

            // Resize
            function resizeGame() {
                if (!container) return;
                width = container.offsetWidth;
                height = container.offsetHeight;
                canvas.width = width;
                canvas.height = height;
            }
            window.addEventListener('resize', resizeGame);
            // Initial call
            setTimeout(resizeGame, 100);

            // Prevent default scroll when game is active or hovered
            window.addEventListener('keydown', (e) => {
                if (gameActive && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                    e.preventDefault();
                }

                if (keys.hasOwnProperty(e.key)) keys[e.key] = true;
                if (e.code === 'Space' && !e.repeat) togglePause();
            });

            window.addEventListener('keyup', (e) => {
                if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
            });

            // Touch
            canvas.addEventListener('touchstart', (e) => {
                if (!gameActive && !hasWon) {
                    initGame();
                }
            }, { passive: false });

            canvas.addEventListener('touchmove', (e) => {
                e.preventDefault();
                if (gameActive && player) {
                    const rect = canvas.getBoundingClientRect();
                    player.x = e.touches[0].clientX - rect.left;
                    player.y = e.touches[0].clientY - rect.top;
                }
            }, { passive: false });

            // Click to Start (Scoped to canvas/container)
            container.addEventListener('click', (e) => {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;

                if (!gameActive && !hasWon) {
                    initGame();
                } else if (gameActive) {
                    togglePause();
                }
            });

            if (continueBtn) {
                continueBtn.addEventListener('click', () => {
                    winScreen.style.display = 'none';
                    gameActive = true;
                    animate();
                });
            }

            // --- CLASSES ---
            class Player {
                constructor() {
                    this.velocity = { x: 0, y: 0 };
                    this.rotation = 0;
                    this.opacity = 1;
                    this.x = width / 2;
                    this.y = height - 100;
                    this.radius = 20;
                    this.speed = 7;
                    this.lastShot = 0;

                    this.pixelSize = 4;
                    this.sprite = [
                        [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
                        [0, 0, 0, 1, 1, 2, 1, 1, 0, 0, 0],
                        [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                        [0, 1, 1, 0, 1, 2, 1, 0, 1, 1, 0],
                        [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
                        [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
                        [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1]
                    ];
                }
                draw() {
                    ctx.save();
                    ctx.translate(this.x, this.y);
                    ctx.globalAlpha = this.opacity;
                    const p = this.pixelSize;
                    const w = this.sprite[0].length * p;
                    const h = this.sprite.length * p;
                    const ox = -w / 2;
                    const oy = -h / 2;
                    const colors = { 1: '#ff0033', 2: '#ffffff' };

                    for (let y = 0; y < this.sprite.length; y++) {
                        for (let x = 0; x < this.sprite[y].length; x++) {
                            const val = this.sprite[y][x];
                            if (val !== 0) {
                                ctx.fillStyle = colors[val] || '#fff';
                                ctx.fillRect(ox + x * p, oy + y * p, p, p);
                            }
                        }
                    }
                    if (keys.w || keys.ArrowUp) {
                        ctx.fillStyle = 'orange';
                        ctx.fillRect(ox + 5 * p - 2, oy + h, 4, Math.random() * 10 + 5);
                    }
                    ctx.restore();
                }
                update() {
                    if (keys.a || keys.ArrowLeft) this.velocity.x = -this.speed;
                    else if (keys.d || keys.ArrowRight) this.velocity.x = this.speed;
                    else this.velocity.x = 0;

                    if (keys.w || keys.ArrowUp) this.velocity.y = -this.speed;
                    else if (keys.s || keys.ArrowDown) this.velocity.y = this.speed;
                    else this.velocity.y = 0;

                    this.x += this.velocity.x * gameSpeed;
                    this.y += this.velocity.y * gameSpeed;

                    if (this.x < this.radius) this.x = this.radius;
                    if (this.x > width - this.radius) this.x = width - this.radius;
                    if (this.y < this.radius) this.y = this.radius;
                    if (this.y > height - this.radius) this.y = height - this.radius;

                    if (frames - this.lastShot > (10 / gameSpeed)) {
                        projectiles.push(new Projectile(this.x, this.y - 20, { x: 0, y: -10 }, '#ff0033', false));
                        this.lastShot = frames;
                    }
                }
            }

            class Projectile {
                constructor(x, y, velocity, color, isEnemy) {
                    this.x = x;
                    this.y = y;
                    this.velocity = velocity;
                    this.width = 4;
                    this.height = 10;
                    this.color = color;
                    this.isEnemy = isEnemy;
                }
                draw() {
                    ctx.fillStyle = this.color;
                    ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
                }
                update() {
                    this.x += this.velocity.x * gameSpeed;
                    this.y += this.velocity.y * gameSpeed;
                }
            }

            class Enemy {
                constructor() {
                    this.radius = 20;
                    this.x = Math.random() * (width - this.radius * 2) + this.radius;
                    this.y = -this.radius;
                    this.speed = Math.random() * 2 + 2 + (score * 0.005);
                    this.velocity = { x: (Math.random() - 0.5) * 1, y: this.speed };
                    this.pixelSize = 3;
                    this.sprite = [
                        [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
                        [0, 0, 0, 1, 1, 2, 1, 1, 0, 0, 0],
                        [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                        [0, 1, 1, 0, 1, 2, 1, 0, 1, 1, 0],
                        [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
                        [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
                        [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1]
                    ];
                }
                draw() {
                    ctx.save();
                    ctx.translate(this.x, this.y);
                    ctx.rotate(Math.PI);
                    const p = this.pixelSize;
                    const w = this.sprite[0].length * p;
                    const h = this.sprite.length * p;
                    const ox = -w / 2;
                    const oy = -h / 2;
                    const colors = { 1: '#b026ff', 2: '#ffffff' };

                    for (let y = 0; y < this.sprite.length; y++) {
                        for (let x = 0; x < this.sprite[y].length; x++) {
                            const val = this.sprite[y][x];
                            if (val !== 0) {
                                ctx.fillStyle = colors[val] || '#fff';
                                ctx.fillRect(ox + x * p, oy + y * p, p, p);
                            }
                        }
                    }
                    ctx.fillStyle = '#ff00ff';
                    ctx.fillRect(ox + 5 * p - 1, oy + h, 2, Math.random() * 6 + 2);
                    ctx.restore();
                }
                update() {
                    this.x += this.velocity.x * gameSpeed;
                    this.y += this.velocity.y * gameSpeed;
                    if (this.x < this.radius || this.x > width - this.radius) this.velocity.x *= -1;
                    if (Math.random() < 0.015 * gameSpeed) {
                        projectiles.push(new Projectile(this.x, this.y + this.radius, { x: 0, y: 6 }, '#ff00ff', true));
                    }
                }
            }

            class Particle {
                constructor(x, y, color) {
                    this.x = x;
                    this.y = y;
                    this.velocity = { x: (Math.random() - 0.5) * 8, y: (Math.random() - 0.5) * 8 };
                    this.radius = Math.random() * 3;
                    this.color = color;
                    this.alpha = 1;
                    this.decay = 0.02 + Math.random() * 0.02;
                }
                draw() {
                    ctx.save();
                    ctx.globalAlpha = this.alpha;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                    ctx.fillStyle = this.color;
                    ctx.fill();
                    ctx.restore();
                }
                update() {
                    this.x += this.velocity.x * gameSpeed;
                    this.y += this.velocity.y * gameSpeed;
                    this.alpha -= this.decay * gameSpeed;
                }
            }

            class Star {
                constructor() {
                    this.x = Math.random() * width;
                    this.y = Math.random() * height;
                    this.radius = Math.random() * 1.5;
                    this.speed = Math.random() * 3 + 0.5;
                    this.opacity = Math.random();
                }
                draw() {
                    ctx.fillStyle = `rgba(50, 50, 50, ${this.opacity})`;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                    ctx.fill();
                }
                update() {
                    this.y += this.speed * gameSpeed;
                    if (this.y > height) {
                        this.y = 0;
                        this.x = Math.random() * width;
                    }
                }
            }

            // --- GAME VARIABLES & FUNCTIONS ---
            let player;
            let projectiles = [];
            let enemies = [];
            let particles = [];
            let stars = [];

            function initGame() {
                gameActive = true;
                gameOver = false;
                isPaused = false;
                hasWon = false;
                score = 0;
                if (scoreEl) scoreEl.textContent = score;
                frames = 0;
                player = new Player();
                projectiles = [];
                enemies = [];
                particles = [];
                if (stars.length === 0) {
                    for (let i = 0; i < 100; i++) stars.push(new Star());
                }
                animate();
            }

            function spawnEnemies() {
                let spawnRate = Math.floor(60 / gameSpeed);
                if (frames % spawnRate === 0) enemies.push(new Enemy());
            }

            function createExplosion(x, y, color) {
                for (let i = 0; i < 15; i++) particles.push(new Particle(x, y, color));
            }

            function togglePause() {
                if (!gameActive) return;
                isPaused = !isPaused;
                if (isPaused) {
                    cancelAnimationFrame(animationId);
                    drawPauseScreen();
                } else {
                    animate();
                }
            }

            function drawPauseScreen() {
                ctx.save();
                ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                ctx.fillRect(0, 0, width, height);
                ctx.fillStyle = '#fff';
                ctx.textAlign = 'center';
                ctx.font = '40px Courier New';
                ctx.fillText('PAUSED', width / 2, height / 2);
                ctx.restore();
            }

            function endGame() {
                gameActive = false;
                gameOver = true;
                createExplosion(player.x, player.y, '#ff0033');
                cancelAnimationFrame(animationId);
                drawGameOverScreen();
            }

            function drawStartScreen() {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                ctx.fillRect(0, 0, width, height);
                ctx.textAlign = 'center';
                ctx.save();
                ctx.fillStyle = '#ff0033';
                ctx.font = 'bold 50px Courier New';
                ctx.fillText('SPACE SHOOTER', width / 2, height / 2 - 50);
                ctx.restore();
                ctx.fillStyle = '#fff';
                ctx.font = '20px Courier New';
                ctx.fillText('Click to Start', width / 2, height / 2 + 10);
                ctx.font = '16px Courier New';
                ctx.fillStyle = '#aaa';
                ctx.fillText('WASD / Arrows to Move', width / 2, height / 2 + 50);
                ctx.fillText('Auto-Fire Enabled', width / 2, height / 2 + 80);
            }

            function drawGameOverScreen() {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                ctx.fillRect(0, 0, width, height);
                ctx.fillStyle = '#ff3333';
                ctx.textAlign = 'center';
                ctx.font = '50px Courier New';
                ctx.fillText('GAME OVER', width / 2, height / 2 - 50);
                ctx.fillStyle = '#fff';
                ctx.font = '30px Courier New';
                ctx.fillText('Score: ' + score, width / 2, height / 2 + 10);
                ctx.font = '20px Courier New';
                ctx.fillText('Click to Restart', width / 2, height / 2 + 60);
            }

            function animate() {
                if (!gameActive) return;
                if (score >= 2500 && !hasWon) {
                    triggerWin();
                    return;
                }
                animationId = requestAnimationFrame(animate);
                ctx.clearRect(0, 0, width, height);

                stars.forEach(star => { star.update(); star.draw(); });
                player.update();
                player.draw();

                particles.forEach((particle, index) => {
                    if (particle.alpha <= 0) particles.splice(index, 1);
                    else { particle.update(); particle.draw(); }
                });

                projectiles.forEach((projectile, index) => {
                    projectile.update();
                    projectile.draw();
                    if (projectile.y < 0 || projectile.y > height) {
                        setTimeout(() => projectiles.splice(index, 1), 0);
                        return;
                    }
                    if (projectile.isEnemy) {
                        const dist = Math.hypot(projectile.x - player.x, projectile.y - player.y);
                        if (dist < player.radius + projectile.width) endGame();
                    } else {
                        enemies.forEach((enemy, eIndex) => {
                            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
                            if (dist < enemy.radius + projectile.width) {
                                createExplosion(enemy.x, enemy.y, '#ff00ff');
                                score += 100;
                                if (scoreEl) scoreEl.textContent = score;
                                setTimeout(() => {
                                    enemies.splice(eIndex, 1);
                                    projectiles.splice(index, 1);
                                }, 0);
                            }
                        });
                    }
                });

                enemies.forEach((enemy, index) => {
                    enemy.update();
                    enemy.draw();
                    const distPlayer = Math.hypot(player.x - enemy.x, player.y - enemy.y);
                    if (distPlayer - enemy.radius - player.radius < 1) {
                        createExplosion(enemy.x, enemy.y, '#ff00ff');
                        endGame();
                    }
                    if (enemy.y - enemy.radius > height) {
                        setTimeout(() => enemies.splice(index, 1), 0);
                    }
                });

                spawnEnemies();
                frames++;
            }

            function triggerWin() {
                hasWon = true;
                gameActive = false;
                cancelAnimationFrame(animationId);
                if (winScreen) winScreen.style.display = 'flex';
            }

            // Init Background
            resizeGame();
            for (let i = 0; i < 100; i++) stars.push(new Star());

            function loop() {
                if (gameActive) return;
                requestAnimationFrame(loop);
                // Matches the background provided in user snippet
                ctx.fillStyle = '#E0DCDC';
                ctx.fillRect(0, 0, width, height);
                stars.forEach(star => { star.update(); star.draw(); });
                if (gameOver) drawGameOverScreen();
                else drawStartScreen();
            }
            loop();
        }

        //new code


        // const form = document.getElementById('contact-form-submit');
        // const btn = document.getElementById('form-btn');
        // // Store original button text so we can revert back exactly
        // const originalBtnText = btn ? btn.innerText : 'SUBMIT INQUIRY';

        // if(form && btn) {
        //     form.addEventListener('submit', function(e) {
        //         e.preventDefault(); // Stop page reload

        //         // 1. Show SENDING State
        //         btn.innerText = 'SENDING...';
        //         btn.style.opacity = '0.7';
        //         btn.style.cursor = 'wait';
        //         btn.disabled = true;

        //         // 2. Prepare Data
        //         const formData = new FormData(form);

        //         // 3. Send Data via AJAX (Using the /ajax/ URL to prevent errors)
        //         fetch("https://formsubmit.co/ajax/info@pickd.in", {
        //             method: "POST",
        //             headers: { 
        //                 'Content-Type': 'application/json',
        //                 'Accept': 'application/json'
        //             },
        //             body: JSON.stringify(Object.fromEntries(formData))
        //         })
        //         .then(response => response.json())
        //         .then(data => {
        //             // 4. Show SUBMITTED State (Black Button)
        //             btn.innerText = 'SUBMITTED';
        //             btn.style.backgroundColor = '#000000'; // Black
        //             btn.style.color = '#ffffff'; // White
        //             btn.style.opacity = '1';
        //             btn.style.cursor = 'default';

        //             // Clear the form fields immediately
        //             form.reset();

        //             // 5. RESET Button back to Default after 3 Seconds
        //             setTimeout(() => {
        //                 btn.innerText = originalBtnText; // Back to "SUBMIT INQUIRY"
        //                 btn.style.backgroundColor = '';  // Revert to original CSS (Red)
        //                 btn.style.color = '';            // Revert to original CSS (White)
        //                 btn.style.cursor = 'pointer';
        //                 btn.disabled = false;            // Make clickable again
        //             }, 3000);
        //         })
        //         .catch(error => {
        //             console.log(error);
        //             alert('Something went wrong. Please check your connection.');
        //             // Reset immediately on error
        //             btn.innerText = originalBtnText;
        //             btn.style.opacity = '1';
        //             btn.style.cursor = 'pointer';
        //             btn.disabled = false;
        //         });
        //     });
        // }


        //google web app code

        // const form = document.getElementById('contact-form-submit');
        // const btn = document.getElementById('form-btn');
        // const originalBtnText = btn ? btn.innerText : 'SUBMIT INQUIRY';

        // if(form && btn) {
        //     form.addEventListener('submit', function(e) {
        //         e.preventDefault(); // Stop page reload

        //         // 1. Show LOADING State
        //         btn.innerText = 'SENDING...';
        //         btn.style.opacity = '0.7';
        //         btn.style.cursor = 'wait';
        //         btn.disabled = true;

        //         // 2. Prepare Data
        //         const formData = new FormData(form);
        //         const data = Object.fromEntries(formData);

        //         // 3. Send to Google Script
        //         // We use 'no-cors' because Google Scripts require it for security from external sites
        //         fetch(form.action, {
        //             method: "POST",
        //             mode: "no-cors", 
        //             headers: {
        //                 "Content-Type": "application/json"
        //             },
        //             body: JSON.stringify(data)
        //         })
        //         .then(() => {
        //             // 4. Success State (Black Button)
        //             // With 'no-cors', we don't get a JSON response, so we assume success if no network error.
        //             btn.innerText = 'SUBMITTED';
        //             btn.style.backgroundColor = '#000000'; // Black
        //             btn.style.color = '#ffffff'; // White
        //             btn.style.opacity = '1';
        //             btn.style.cursor = 'default';

        //             form.reset();

        //             // 5. Reset Button after 3 seconds
        //             setTimeout(() => {
        //                 btn.innerText = originalBtnText;
        //                 btn.style.backgroundColor = ''; // Revert to Red
        //                 btn.style.color = ''; 
        //                 btn.style.cursor = 'pointer';
        //                 btn.disabled = false;
        //             }, 3000);
        //         })
        //         .catch(error => {
        //             console.error('Error:', error);
        //             alert('Something went wrong. Please check your internet.');
        //             btn.innerText = originalBtnText;
        //             btn.disabled = false;
        //         });
        //     });
        // }

        const form = document.getElementById('contact-form-submit');
        const btn = document.getElementById('form-btn');
        const originalBtnText = btn ? btn.innerText : 'SUBMIT INQUIRY';

        if (form && btn) {

            /* ✅ SAFER CHANGE: lock minimum width only */
            const minBtnWidth = btn.offsetWidth;
            btn.style.minWidth = minBtnWidth + 'px';

            form.addEventListener('submit', function (e) {
                e.preventDefault();

                btn.innerText = 'SENDING...';
                btn.style.opacity = '0.7';
                btn.style.cursor = 'wait';
                btn.disabled = true;

                const formData = new FormData(form);
                const data = new URLSearchParams();

                for (const pair of formData) {
                    data.append(pair[0], pair[1]);
                }

                fetch(form.action, {
                    method: "POST",
                    mode: "no-cors",
                    body: data
                })
                    .then(() => {
                        btn.innerText = 'SUBMITTED';
                        btn.style.backgroundColor = '#000000';
                        btn.style.color = '#ffffff';
                        btn.style.cursor = 'default';

                        form.reset();

                        setTimeout(() => {
                            btn.innerText = originalBtnText;
                            btn.style.backgroundColor = '#FE3634';
                            btn.style.color = '#ffffff';
                            btn.style.cursor = 'pointer';
                            btn.disabled = false;
                        }, 3000);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        btn.innerText = originalBtnText;
                        btn.disabled = false;
                        alert('Something went wrong. Please check your connection.');
                    });
            });
        }


        //     const form = document.querySelector("form");
        // const btn = document.getElementById("form-btn");
        // const text = btn.querySelector(".btn-text");
        // const loader = btn.querySelector(".btn-loader");

        // form.addEventListener("submit", (e)=>{
        //   e.preventDefault();

        //   btn.disabled = true;
        //   text.textContent = "SENDING";
        //   loader.hidden = false;

        //   setTimeout(()=>{
        //     loader.hidden = true;
        //     text.textContent = "SUBMITTED";

        //     setTimeout(()=>{
        //       btn.disabled = false;
        //       text.textContent = "SEND ENQUIRY";
        //     }, 1500);
        //   }, 2000);
        // });


    
