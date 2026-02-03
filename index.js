// ========================================
// デジタル・タイポグラフィ アニメーション
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // GSAP と ScrollTrigger の登録
    gsap.registerPlugin(ScrollTrigger);

    const chars = document.querySelectorAll('.char');
    const archObjects = document.querySelectorAll('.arch-obj');

    if (chars.length > 0) {
        // 初期状態の配置データを保存
        const floatingAnimations = [];

        // 初期状態：ランダムな位置と回転でアンチグラビティ状態に配置
        chars.forEach((char, index) => {
            const randomX = (Math.random() - 0.5) * window.innerWidth * 0.8;
            const randomY = (Math.random() - 0.5) * window.innerHeight * 0.6;
            const randomRotation = (Math.random() - 0.5) * 180;
            const randomDelay = Math.random() * 0.5;

            // 初期状態を設定
            gsap.set(char, {
                x: randomX,
                y: randomY,
                rotation: randomRotation,
                opacity: 0.7,
            });

            // ふわふわと浮遊するアニメーション（後でkillするために保存）
            const floatAnim = gsap.to(char, {
                y: `+=${(Math.random() - 0.5) * 30}`,
                duration: 2 + Math.random() * 2,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: randomDelay
            });

            floatingAnimations.push(floatAnim);
        });

        // 背景画像要素とシネマティックオーバーレイの取得
        const heroBg = document.getElementById('hero-bg');
        const cinematicOverlay = document.getElementById('cinematic-overlay');

        // ScrollTriggerを使ったタイムラインアニメーション
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.hero-section',
                start: 'top top',
                end: 'bottom center',
                scrub: 1,
                onEnter: () => {
                    // スクロール開始時に浮遊アニメーションを停止
                    floatingAnimations.forEach(anim => anim.kill());
                },
                onUpdate: (self) => {
                    // スクロール進行度に応じて光の演出、背景のblur、シネマティックフィルターを制御
                    const progress = self.progress;

                    // 60%以上スクロールしたら光を追加、それ以下なら削除
                    if (progress > 0.6) {
                        chars.forEach(char => char.classList.add('assembled'));
                        // 背景画像のblurを解除
                        if (heroBg) heroBg.classList.add('focused');
                        // シネマティックフィルターを適用
                        if (cinematicOverlay) {
                            cinematicOverlay.classList.add('active');
                            // 追加のフィルター効果（コントラストとセピア）
                            cinematicOverlay.style.filter = 'contrast(1.1) sepia(0.15)';
                        }
                    } else {
                        chars.forEach(char => char.classList.remove('assembled'));
                        // 背景画像のblurを復活
                        if (heroBg) heroBg.classList.remove('focused');
                        // シネマティックフィルターを解除
                        if (cinematicOverlay) {
                            cinematicOverlay.classList.remove('active');
                            cinematicOverlay.style.filter = 'none';
                        }
                    }
                }
            }
        });

        // 各文字が正しい位置に集まるアニメーション
        chars.forEach((char, index) => {
            tl.to(char, {
                x: 0,
                y: 0,
                rotation: 0,
                opacity: 1,
                duration: 1,
                ease: 'back.out(1.7)', // Back.easeOut で高級感のあるバウンド
            }, index * 0.03); // 文字ごとに少しずつ遅延（タイムライン上の位置をずらす）
        });

        // 反重力オブジェクトの退場アニメーション
        if (archObjects.length > 0) {
            const objectsTl = gsap.timeline({
                scrollTrigger: {
                    trigger: '.hero-section',
                    start: 'top top',
                    end: 'bottom center',
                    scrub: 1,
                }
            });

            archObjects.forEach((obj, index) => {
                // 各オブジェクトの位置に応じて退場方向を決定
                const rect = obj.getBoundingClientRect();
                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;

                // オブジェクトが画面中央より左にあるか右にあるか
                const isLeft = rect.left < centerX;
                const isTop = rect.top < centerY;

                // 退場方向を計算（画面の外側へ）
                const exitX = isLeft ? -window.innerWidth * 0.5 : window.innerWidth * 0.5;
                const exitY = isTop ? -window.innerHeight * 0.3 : window.innerHeight * 0.3;

                objectsTl.to(obj, {
                    x: exitX,
                    y: exitY,
                    opacity: 0,
                    duration: 1,
                    ease: 'power2.in',
                }, index * 0.05);
            });
        }
    }
});

// スクロールイベントで逆方向パララックス効果を実装
document.addEventListener('DOMContentLoaded', () => {
    const parallaxElement = document.getElementById('parallax-bg');

    if (!parallaxElement) return;

    // スクロールイベントハンドラー
    const handleScroll = () => {
        const scrollPosition = window.scrollY;

        // 通常のスクロールとは逆方向に動かす（スクロールダウン時に上へ移動）
        // 速度を調整（0.3倍速）
        const offset = scrollPosition * 0.3;

        // transformを使用してパフォーマンスを最適化
        parallaxElement.style.transform = `translateY(-${offset}px)`;
    };

    // スクロールイベントをリスナーに追加
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 初期状態の設定
    handleScroll();

    // オプション：ページロード時のフェードインアニメーション
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// 浮遊要素にマウスホバーで微妙な反応を追加（オプション）
document.addEventListener('DOMContentLoaded', () => {
    const floatingElements = document.querySelectorAll('.floating-element-1, .floating-element-2, .floating-element-3, .floating-element-4');

    floatingElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.animationPlayState = 'paused';
            element.style.transition = 'opacity 0.3s ease';
            element.style.opacity = '0.3';
        });

        element.addEventListener('mouseleave', () => {
            element.style.animationPlayState = 'running';
            element.style.opacity = '0.15';
        });
    });
});

// スムーズスクロールの実装（将来的なナビゲーション用）
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ビューポートに入った要素をフェードインさせる（今後のセクション用）
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-visible');
        }
    });
}, observerOptions);

// .fade-in クラスを持つ要素を監視
document.querySelectorAll('.fade-in').forEach(element => {
    observer.observe(element);
});

// ========================================
// Works セクション アンチグラビティ演出
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const worksHeader = document.querySelector('.works-header');
    const workCards = document.querySelectorAll('.work-card');

    if (!worksHeader || workCards.length === 0) return;

    // セクションヘッダーのアニメーション
    gsap.to(worksHeader, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: worksHeader,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        }
    });

    // 各カードの「奥から手前へ浮き上がる」アニメーション
    workCards.forEach((card, index) => {
        // カードごとに異なる遅延を設定
        const delay = index * 0.15;

        gsap.to(card, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            delay: delay,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                end: 'top 50%',
                toggleActions: 'play none none reverse',
                // スクラブではなくトリガーベースで実行
            }
        });
    });

    // 反重力ホバーエフェクト（タッチデバイス対応）
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    workCards.forEach(card => {
        const inner = card.querySelector('.work-card-inner');
        if (!inner) return;

        if (isTouchDevice) {
            // タッチデバイス：タップでホバー状態をトグル
            let isActive = false;

            inner.addEventListener('touchstart', (e) => {
                // 他のカードのアクティブ状態を解除
                workCards.forEach(otherCard => {
                    if (otherCard !== card) {
                        const otherInner = otherCard.querySelector('.work-card-inner');
                        if (otherInner) {
                            otherInner.classList.remove('touch-active');
                        }
                    }
                });

                isActive = !isActive;
                inner.classList.toggle('touch-active', isActive);
            });
        }

        // マウス移動による微細な3Dチルト効果（デスクトップのみ）
        if (!isTouchDevice) {
            inner.addEventListener('mousemove', (e) => {
                const rect = inner.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                // 傾きを計算（-5度〜+5度の範囲）
                const rotateX = ((y - centerY) / centerY) * -5;
                const rotateY = ((x - centerX) / centerX) * 5;

                gsap.to(inner, {
                    rotationX: rotateX,
                    rotationY: rotateY,
                    transformPerspective: 1000,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            inner.addEventListener('mouseleave', () => {
                gsap.to(inner, {
                    rotationX: 0,
                    rotationY: 0,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            });
        }
    });
});

// ========================================
// Works セクション パララックススクロール
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const workCards = document.querySelectorAll('.work-card');

    if (workCards.length === 0) return;

    // 各カードに異なる速度のパララックスを適用
    workCards.forEach((card, index) => {
        // 奇数・偶数で異なるパララックス速度
        const speed = index % 2 === 0 ? 30 : -30;

        gsap.to(card, {
            y: speed,
            ease: 'none',
            scrollTrigger: {
                trigger: '.works-section',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
            }
        });
    });
});

// ========================================
// About セクション 建築図面描画アニメーション
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const aboutSection = document.querySelector('.about-section');
    const drawLines = document.querySelectorAll('.draw-line');
    const aboutLines = document.querySelectorAll('.about-line');
    const dimensionTexts = document.querySelectorAll('.dimension-text');
    const blueprintLabel = document.querySelector('.blueprint-label');

    if (!aboutSection || drawLines.length === 0) return;

    // 各SVGパスの長さを計算してstroke-dasharrayを設定
    drawLines.forEach(line => {
        let length;
        if (line.tagName === 'path') {
            length = line.getTotalLength();
        } else if (line.tagName === 'rect') {
            const width = parseFloat(line.getAttribute('width')) || 0;
            const height = parseFloat(line.getAttribute('height')) || 0;
            length = (width + height) * 2;
        } else if (line.tagName === 'circle') {
            const r = parseFloat(line.getAttribute('r')) || 0;
            length = 2 * Math.PI * r;
        } else {
            length = 1000;
        }
        line.style.strokeDasharray = length;
        line.style.strokeDashoffset = length;
    });

    // SVG描画アニメーション（スクロール同期）
    const drawTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: aboutSection,
            start: 'top 60%',
            end: 'bottom 40%',
            scrub: 1.5, // スムーズなスクラブ
        }
    });

    // 線を順番に描画（各線に微妙な遅延）
    drawLines.forEach((line, index) => {
        let length;
        if (line.tagName === 'path') {
            length = line.getTotalLength();
        } else if (line.tagName === 'rect') {
            const width = parseFloat(line.getAttribute('width')) || 0;
            const height = parseFloat(line.getAttribute('height')) || 0;
            length = (width + height) * 2;
        } else if (line.tagName === 'circle') {
            const r = parseFloat(line.getAttribute('r')) || 0;
            length = 2 * Math.PI * r;
        } else {
            length = 1000;
        }

        // 各線の描画アニメーション
        drawTimeline.to(line, {
            strokeDashoffset: 0,
            duration: 1,
            ease: 'none',
        }, index * 0.03); // 線ごとに少しずつ遅延
    });

    // 寸法テキストの表示（描画が60%完了した時点）
    ScrollTrigger.create({
        trigger: aboutSection,
        start: 'top 30%',
        onEnter: () => {
            dimensionTexts.forEach((text, i) => {
                setTimeout(() => {
                    text.classList.add('visible');
                }, i * 100);
            });
            if (blueprintLabel) {
                setTimeout(() => {
                    blueprintLabel.classList.add('visible');
                }, 500);
            }
        },
        onLeaveBack: () => {
            dimensionTexts.forEach(text => text.classList.remove('visible'));
            if (blueprintLabel) blueprintLabel.classList.remove('visible');
        }
    });

    // テキストの「浮上」演出（一行ずつ）
    aboutLines.forEach((line, index) => {
        gsap.to(line, {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: line,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
            },
            delay: index * 0.1, // 行ごとに遅延
        });
    });
});

// ========================================
// 背景画像のパララックス効果
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const heroBg = document.getElementById('hero-bg');

    if (!heroBg) return;

    // スクロールによるパララックス（背景が文字よりもゆっくり動く）
    gsap.to(heroBg, {
        y: '20%',
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
        }
    });
});

// ========================================
// ジャイロセンサー & マウス移動による3D Tilt効果
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const heroBg = document.getElementById('hero-bg');

    if (!heroBg) return;

    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    // スムーズな動きのための補間
    const lerp = (start, end, factor) => {
        return start + (end - start) * factor;
    };

    // アニメーションループ
    const animate = () => {
        currentX = lerp(currentX, targetX, 0.1);
        currentY = lerp(currentY, targetY, 0.1);

        // 背景画像を微妙に傾ける（-5度〜+5度の範囲）
        gsap.to(heroBg, {
            rotationY: currentX * 5,
            rotationX: -currentY * 5,
            duration: 0.5,
            ease: 'power2.out',
            transformPerspective: 1000,
            transformOrigin: 'center center',
        });

        requestAnimationFrame(animate);
    };

    animate();

    // マウス移動による傾き（デスクトップ）
    document.addEventListener('mousemove', (e) => {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // マウス位置を-1〜1の範囲に正規化
        targetX = (e.clientX / windowWidth) * 2 - 1;
        targetY = (e.clientY / windowHeight) * 2 - 1;
    });

    // ジャイロセンサーによる傾き（iPhone/スマホ）
    if (window.DeviceOrientationEvent) {
        // iOS13以降は許可が必要
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            // ユーザーが画面をタップしたら許可をリクエスト
            const requestPermission = () => {
                DeviceOrientationEvent.requestPermission()
                    .then(permissionState => {
                        if (permissionState === 'granted') {
                            window.addEventListener('deviceorientation', handleOrientation);
                        }
                    })
                    .catch(console.error);
            };

            // 最初のタッチで許可をリクエスト
            document.addEventListener('touchstart', requestPermission, { once: true });
        } else {
            // Android や古いiOSは直接リスナーを追加
            window.addEventListener('deviceorientation', handleOrientation);
        }
    }

    // ジャイロセンサーのデータを処理
    function handleOrientation(event) {
        // beta: 前後の傾き（-180〜180）
        // gamma: 左右の傾き（-90〜90）
        const beta = event.beta;
        const gamma = event.gamma;

        // 傾きを-1〜1の範囲に正規化（控えめに）
        targetX = Math.max(-1, Math.min(1, gamma / 45));
        targetY = Math.max(-1, Math.min(1, (beta - 45) / 45));
    }
});
