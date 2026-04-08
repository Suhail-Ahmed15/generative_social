/**
 * Zenith Social App Logic
 * Handles screen navigation, media upload, and post generation.
 */
// code
const app = {
    state: {
        currentScreen: 'upload',
        uploadedFile: null,
        platforms: {
            linkedin: true,
            instagram: false,
            reddit: false,
            x: true
        },
        tone: 'Aesthetic',
        hooks: '',
        generatedPosts: []
    },

    init() {
        this.setupEventListeners();
        this.updatePlatformStatuses();
        console.log('Zenith App Initialized');
    },

    setupEventListeners() {
        // Navigation clicks
        // Already handled by inline onclick for simplicity in this demo

        // File input change
        const fileInput = document.getElementById('file-input');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        }

        // Drop zone handling
        const dropZone = document.getElementById('drop-zone');
        if (dropZone) {
            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.classList.add('bg-primary/5', 'border-primary');
            });
            dropZone.addEventListener('dragleave', () => {
                dropZone.classList.remove('bg-primary/5', 'border-primary');
            });
            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.classList.remove('bg-primary/5', 'border-primary');
                if (e.dataTransfer.files.length) {
                    this.processFile(e.dataTransfer.files[0]);
                }
            });
            // Make dropzone clickable
            dropZone.addEventListener('click', (e) => {
                if (e.target.tagName !== 'BUTTON') {
                    fileInput.click();
                }
            });
        }

        // Tone selection
        document.querySelectorAll('.tone-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tone = e.target.getAttribute('data-tone');
                this.setTone(tone);
            });
        });

        // Hooks textarea
        const hooksArea = document.getElementById('hooks-textarea');
        if (hooksArea) {
            hooksArea.addEventListener('input', (e) => {
                this.state.hooks = e.target.value;
            });
        }

        // Platform toggles
        document.querySelectorAll('.platform-toggle').forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                const platform = e.target.getAttribute('data-platform');
                this.state.platforms[platform] = e.target.checked;
                this.updatePlatformStatuses();
            });
        });
    },

    navigateTo(screenId) {
        // Update state
        this.state.currentScreen = screenId;

        // Hide all screens
        document.querySelectorAll('[data-screen]').forEach(screen => {
            screen.classList.remove('active', 'opacity-100');
            screen.classList.add('opacity-0');
            setTimeout(() => {
                if (screen.id !== `screen-${screenId}`) {
                    screen.style.display = 'none';
                }
            }, 300);
        });

        // Show target screen
        const targetScreen = document.getElementById(`screen-${screenId}`);
        if (targetScreen) {
            targetScreen.style.display = 'block';
            setTimeout(() => {
                targetScreen.classList.add('active', 'opacity-100');
            }, 50);
        }

        // Update Bottom Nav UI
        this.updateNavUI(screenId);
        
        // Scroll to top
        window.scrollTo(0, 0);
    },

    updateNavUI(screenId) {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('text-indigo-700', 'bg-indigo-50', 'scale-110');
            item.classList.add('text-slate-400');
        });

        const activeNav = document.getElementById(`nav-home`); // In this demo, all lead back or are main
        if (activeNav) {
            activeNav.classList.add('text-indigo-700', 'bg-indigo-50', 'scale-110');
            activeNav.classList.remove('text-slate-400');
        }
    },

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            this.processFile(file);
        }
    },

    processFile(file) {
        this.state.uploadedFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('preview-image');
            const overlay = document.getElementById('preview-overlay');
            const status = document.getElementById('upload-status');
            
            if (preview) {
                preview.src = e.target.result;
                preview.classList.remove('grayscale', 'opacity-60');
            }
            if (overlay) overlay.style.display = 'none';
            if (status) {
                status.innerHTML = '<span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Uploaded';
                status.classList.remove('bg-primary/10', 'text-primary');
                status.classList.add('bg-green-100', 'text-green-700');
            }
        };
        reader.readAsDataURL(file);
    },

    setTone(tone) {
        this.state.tone = tone;
        document.querySelectorAll('.tone-btn').forEach(btn => {
            btn.classList.remove('bg-primary-container/20', 'text-primary', 'border-primary/20');
            btn.classList.add('bg-surface-container', 'text-on-surface-variant');
            
            if (btn.getAttribute('data-tone') === tone) {
                btn.classList.add('bg-primary-container/20', 'text-primary', 'border-primary/20');
                btn.classList.remove('bg-surface-container', 'text-on-surface-variant');
            }
        });
    },

    updatePlatformStatuses() {
        Object.keys(this.state.platforms).forEach(platform => {
            const card = document.querySelector(`.platform-card[data-platform="${platform}"]`);
            if (card) {
                const statusText = card.querySelector('.status-text');
                const isChecked = this.state.platforms[platform];
                
                if (isChecked) {
                    statusText.textContent = 'Activated';
                    statusText.classList.remove('text-on-surface-variant');
                    statusText.classList.add('text-primary-dim');
                    card.classList.add('ring-2', 'ring-primary/20');
                } else {
                    statusText.textContent = 'Disabled';
                    statusText.classList.add('text-on-surface-variant');
                    statusText.classList.remove('text-primary-dim');
                    card.classList.remove('ring-2', 'ring-primary/20');
                }
            }
        });
    },

    generatePosts() {
        // Check if at least one platform is selected
        const selectedPlatforms = Object.keys(this.state.platforms).filter(p => this.state.platforms[p]);
        if (selectedPlatforms.length === 0) {
            alert('Please select at least one platform.');
            return;
        }

        // Show loading state
        const generateBtn = document.querySelector('#screen-platforms button[onclick="app.generatePosts()"]');
        const originalContent = generateBtn.innerHTML;
        generateBtn.disabled = true;
        generateBtn.innerHTML = `
            <span class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <span>Processing Brief...</span>
        `;

        setTimeout(() => {
            // Populate generated posts
            this.state.generatedPosts = this.getMockPosts(selectedPlatforms);
            this.renderResults();
            this.navigateTo('results');
            
            // Reset button
            generateBtn.disabled = false;
            generateBtn.innerHTML = originalContent;
        }, 1500);
    },

    getMockPosts(platforms) {
        const posts = [];
        const previewSrc = document.getElementById('preview-image').src;
        const profileImg = "https://lh3.googleusercontent.com/aida-public/AB6AXuDk6ba8eyYpDk2YQaLiTnI0BpGgpo4H0UN6liHFAcGGADXbnWjqaMQMDohfyhNPfW2AHnu4fiV38e6YmbBI0gX2yOBJlz79ygd9gusHxFaXoXIWtSYy6b1sS8eQk0jl9rUIGK48fh3D6O4pWz5FrgdG8v79GIxfpaxl8-jCefw26b_7YQuQNov6AnKYKHMyoHSuuxDFr4Vmfd8Ua_rLqf7PWSWTa_ZUetqh-HGKK6iJZVMsIAzHCWr5mLT6uu8gwBm80PZnaHFpEy_2";

        if (platforms.includes('linkedin')) {
            posts.push({
                platform: 'linkedin',
                title: 'Professional Insight',
                user: 'Sarah Jenkins',
                handle: 'Creative Director at Zenith',
                body: `The future of social storytelling isn't just about the content—it's about the connection. 🚀\n\nI’ve spent the last decade watching platforms evolve, but the core principle remains: authenticity wins. Today, we're launching a tool that helps creators find their voice without losing their soul.\n\nKey takeaways from our latest research:\n- Consistency over perfection\n- Community-led growth strategies\n- The rise of the 'Atelier' aesthetic\n\n#CreativeLeadership #ZenithSocial #FutureOfWork`,
                image: previewSrc,
                profile: profileImg
            });
        }
        if (platforms.includes('instagram')) {
            posts.push({
                platform: 'instagram',
                title: 'Visual Story',
                user: 'zenith_social',
                handle: '',
                body: `Designing for the future. Our new interface isn't just a tool, it's a canvas for your digital legacy. ✨`,
                image: previewSrc,
                profile: profileImg
            });
        }
        if (platforms.includes('reddit')) {
            posts.push({
                platform: 'reddit',
                title: 'Community Discussion',
                user: 'u/zenith_dev',
                handle: 'r/ContentCreation',
                body: `Does anyone else feel like current AI tools are stripping the 'soul' out of social media? We built something different.\n\nWe've been working on a project called Zenith for the past 14 months. Instead of "generative noise," we focused on editorial structures and high-end design systems that allow creators to keep their brand identity while scaling production.\n\nWould love to get some feedback from this community on our 'Curated Atelier' approach. Is the UI too minimalist?`,
                image: previewSrc,
                profile: profileImg
            });
        }
        if (platforms.includes('x')) {
            posts.push({
                platform: 'x',
                title: 'Real-time Thread',
                user: 'Sarah Jenkins',
                handle: '@sarah_zenith',
                body: `Stop using generic templates for your brand. 🧵\n\nIn 2024, the "SaaS look" is the new Comic Sans. We're launching Organic Brutalism for social creators today.\n\nIt’s bold. It’s editorial. It’s Zenith. ⚡️`,
                image: previewSrc,
                profile: profileImg
            });
        }
        return posts;
    },

    renderResults() {
        const container = document.getElementById('results-container');
        if (!container) return;
        
        container.innerHTML = '';
        this.state.generatedPosts.forEach(post => {
            const section = document.createElement('section');
            section.className = 'relative';
            
            let html = `
                <div class="flex items-center gap-3 mb-4 px-2">
                    <span class="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-sm text-xs font-bold font-label uppercase tracking-widest">${post.platform}</span>
                    <div class="h-[1px] flex-grow bg-outline-variant/20"></div>
                </div>
                <div class="bg-surface-container-lowest rounded-xl shadow-[0_12px_40px_-4px_rgba(44,47,49,0.06)] border-[0.5px] border-outline-variant/10 overflow-hidden">
            `;

            if (post.platform === 'linkedin') {
                html += `
                    <div class="p-8">
                        <div class="flex gap-4 mb-6">
                            <div class="w-12 h-12 rounded-lg bg-slate-200 overflow-hidden">
                                <img class="w-full h-full object-cover" src="${post.profile}"/>
                            </div>
                            <div>
                                <p class="font-bold text-on-surface leading-none">${post.user}</p>
                                <p class="text-xs text-on-surface-variant mt-1">${post.handle} • 1h</p>
                            </div>
                        </div>
                        <div class="space-y-4 text-on-surface leading-relaxed font-body">
                            <p>${post.body.replace(/\n/g, '<br>')}</p>
                        </div>
                        <div class="mt-8 pt-8 flex gap-4">
                            <button onclick="app.copyToClipboard('${post.body}')" class="flex-1 py-3 px-6 bg-primary rounded-full text-on-primary font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all scale-95 active:scale-90">
                                <span class="material-symbols-outlined text-sm" data-icon="content_copy">content_copy</span>
                                Copy Content
                            </button>
                            <button class="flex-1 py-3 px-6 bg-secondary-container rounded-full text-on-secondary-container font-bold flex items-center justify-center gap-2 hover:bg-secondary-fixed transition-all scale-95 active:scale-90">
                                <span class="material-symbols-outlined text-sm" data-icon="share">share</span>
                                Share
                            </button>
                        </div>
                    </div>
                `;
            } else if (post.platform === 'instagram') {
                html += `
                    <div class="aspect-square bg-slate-100 relative">
                        <img class="w-full h-full object-cover" src="${post.image}"/>
                    </div>
                    <div class="p-8">
                        <div class="flex items-center gap-4 mb-4">
                            <span class="material-symbols-outlined text-primary" data-icon="favorite" style="font-variation-settings: 'FILL' 1;">favorite</span>
                            <span class="material-symbols-outlined" data-icon="chat_bubble">chat_bubble</span>
                            <span class="material-symbols-outlined" data-icon="send">send</span>
                        </div>
                        <p class="font-body text-on-surface">
                            <span class="font-bold">${post.user}</span> ${post.body}
                        </p>
                        <div class="mt-8 flex gap-4">
                            <button onclick="app.copyToClipboard('${post.body}')" class="flex-1 py-3 px-6 bg-primary rounded-full text-on-primary font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all scale-95 active:scale-90">
                                <span class="material-symbols-outlined text-sm" data-icon="content_copy">content_copy</span>
                                Copy
                            </button>
                            <button class="flex-1 py-3 px-6 bg-secondary-container rounded-full text-on-secondary-container font-bold flex items-center justify-center gap-2 hover:bg-secondary-fixed transition-all scale-95 active:scale-90">
                                <span class="material-symbols-outlined text-sm" data-icon="share">share</span>
                                Share
                            </button>
                        </div>
                    </div>
                `;
            } else if (post.platform === 'reddit') {
                html += `
                    <div class="flex">
                        <div class="w-12 bg-surface-container-high flex flex-col items-center py-4 gap-2">
                            <span class="material-symbols-outlined text-on-surface-variant" data-icon="arrow_upward">arrow_upward</span>
                            <span class="text-xs font-bold">1.2k</span>
                            <span class="material-symbols-outlined text-on-surface-variant" data-icon="arrow_downward">arrow_downward</span>
                        </div>
                        <div class="p-8 flex-1 bg-surface-container-lowest">
                            <div class="flex items-center gap-2 mb-2 text-xs text-on-surface-variant">
                                <span class="font-bold text-on-surface">${post.handle}</span>
                                <span>• Posted by ${post.user} 4 hours ago</span>
                            </div>
                            <h3 class="text-xl font-bold mb-4 leading-tight">Mock Reddit Title for ${this.state.tone} Content</h3>
                            <p class="font-body text-on-surface leading-relaxed mb-6">${post.body.replace(/\n/g, '<br>')}</p>
                            <div class="mt-8 flex gap-4">
                                <button onclick="app.copyToClipboard('${post.body}')" class="flex-1 py-3 px-6 bg-primary rounded-full text-on-primary font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all scale-95 active:scale-90">
                                    <span class="material-symbols-outlined text-sm" data-icon="content_copy">content_copy</span>
                                    Copy Body
                                </button>
                                <button class="flex-1 py-3 px-6 bg-secondary-container rounded-full text-on-secondary-container font-bold flex items-center justify-center gap-2 hover:bg-secondary-fixed transition-all scale-95 active:scale-90">
                                    <span class="material-symbols-outlined text-sm" data-icon="share">share</span>
                                    Share Post
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            } else if (post.platform === 'x') {
                html += `
                    <div class="p-8">
                        <div class="flex gap-4">
                            <div class="w-12 h-12 rounded-full bg-slate-200 overflow-hidden shrink-0">
                                <img class="w-full h-full object-cover" src="${post.profile}"/>
                            </div>
                            <div class="flex-1">
                                <div class="flex items-center gap-1 mb-1">
                                    <p class="font-bold text-on-surface">${post.user}</p>
                                    <span class="material-symbols-outlined text-primary text-sm" data-icon="verified" style="font-variation-settings: 'FILL' 1;">verified</span>
                                    <span class="text-on-surface-variant text-sm ml-1">${post.handle} • 12m</span>
                                </div>
                                <p class="text-lg leading-relaxed text-on-surface font-body mb-4">${post.body.replace(/\n/g, '<br>')}</p>
                                <div class="flex justify-between max-w-sm text-on-surface-variant">
                                    <span class="material-symbols-outlined text-sm" data-icon="chat_bubble_outline">chat_bubble_outline</span>
                                    <span class="material-symbols-outlined text-sm" data-icon="repeat">repeat</span>
                                    <span class="material-symbols-outlined text-sm" data-icon="favorite_border">favorite_border</span>
                                    <span class="material-symbols-outlined text-sm" data-icon="bar_chart">bar_chart</span>
                                </div>
                            </div>
                        </div>
                        <div class="mt-8 pt-8 border-t border-outline-variant/10 flex gap-4">
                            <button onclick="app.copyToClipboard('${post.body}')" class="flex-1 py-3 px-6 bg-primary rounded-full text-on-primary font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all scale-95 active:scale-90">
                                <span class="material-symbols-outlined text-sm" data-icon="content_copy">content_copy</span>
                                Copy Thread
                            </button>
                            <button class="flex-1 py-3 px-6 bg-secondary-container rounded-full text-on-secondary-container font-bold flex items-center justify-center gap-2 hover:bg-secondary-fixed transition-all scale-95 active:scale-90">
                                <span class="material-symbols-outlined text-sm" data-icon="share">share</span>
                                Share
                            </button>
                        </div>
                    </div>
                `;
            }

            html += `</div>`;
            section.innerHTML = html;
            container.appendChild(section);
        });
    },

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            alert('Content copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }
};

document.addEventListener('DOMContentLoaded', () => app.init());
