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
                    // スクロール進行度に応じて光の演出を制御
                    const progress = self.progress;

                    // 60%以上スクロールしたら光を追加、それ以下なら削除
                    if (progress > 0.6) {
                        chars.forEach(char => char.classList.add('assembled'));
                    } else {
                        chars.forEach(char => char.classList.remove('assembled'));
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
