/**
 * 溪石 - 内容分享平台
 * JavaScript 应用逻辑
 */

// 应用状态
const App = {
    posts: [],
    currentPostId: null,
    editingPostId: null,
    draftSaveTimer: null,

    // 初始化
    init() {
        this.loadPosts();
        this.bindEvents();
        this.renderPosts();
        this.loadDraft();
    },

    // 从 LocalStorage 加载文章
    loadPosts() {
        const saved = localStorage.getItem('xishi_posts');
        if (saved) {
            this.posts = JSON.parse(saved);
        } else {
            // 添加示例文章
            this.posts = [
                {
                    id: Date.now(),
                    title: '欢迎来到溪石',
                    content: '溪石是一个优雅的纯文字内容分享平台。在这里，你可以自由地书写你的想法，分享你的故事。\n\n我们相信，最好的内容不需要华丽的装饰，文字本身就是最有力量的表达方式。\n\n点击右上角的"写文章"按钮，开始你的创作之旅吧！',
                    createdAt: Date.now(),
                    views: 128
                },
                {
                    id: Date.now() + 1,
                    title: '关于写作这件事',
                    content: '写作是一种思考的方式。当我们把想法付诸文字时，那些模糊的念头会变得清晰起来。\n\n有人说，写作是与自己对话的过程。你在键盘上敲下的每一个字，都是内心世界的投影。\n\n不必追求完美，重要的是开始。每一篇文章都是成长的印记，每一次表达都是心灵的释放。',
                    createdAt: Date.now() - 86400000,
                    views: 256
                }
            ];
            this.savePosts();
        }
    },

    // 保存文章到 LocalStorage
    savePosts() {
        localStorage.setItem('xishi_posts', JSON.stringify(this.posts));
    },

    bindEvents() {
        // Logo - 回到首页
        document.getElementById('logo').addEventListener('click', (e) => {
            e.preventDefault();
            this.showView('homeView');
        });

        // 新建文章
        document.getElementById('newPostBtn').addEventListener('click', () => {
            this.editingPostId = null;
            document.getElementById('editorTitle').value = '';
            document.getElementById('editorContent').value = '';
            this.updateTitleCount();
            this.updateWordCount();
            this.showView('editorView');
            document.getElementById('editorTitle').focus();
        });

        // 搜索
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchPosts(e.target.value);
        });

        // 筛选标签
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.filterPosts(tab.dataset.filter);
            });
        });

        // 返回按钮
        document.getElementById('backBtn').addEventListener('click', () => {
            this.showView('homeView');
        });

        // 编辑器返回
        document.getElementById('editorBackBtn').addEventListener('click', () => {
            this.showView('homeView');
        });

        // 发布按钮
        document.getElementById('publishBtn').addEventListener('click', () => {
            this.publishPost();
        });

        // 编辑按钮
        document.getElementById('editPostBtn').addEventListener('click', () => {
            this.editPost(this.currentPostId);
        });

        // 删除按钮
        document.getElementById('deletePostBtn').addEventListener('click', () => {
            document.getElementById('deleteModal').classList.remove('hidden');
        });

        // 取消删除
        document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
            document.getElementById('deleteModal').classList.add('hidden');
        });

        // 确认删除
        document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
            this.deletePost(this.currentPostId);
            document.getElementById('deleteModal').classList.add('hidden');
            this.showView('homeView');
            this.showToast('文章已删除', 'success');
        });

        // 标题字数统计
        document.getElementById('editorTitle').addEventListener('input', () => {
            this.updateTitleCount();
            this.saveDraft();
        });

        // 内容字数统计
        document.getElementById('editorContent').addEventListener('input', () => {
            this.updateWordCount();
            this.saveDraft();
        });
    },

    // 切换视图
    showView(viewId) {
        document.querySelectorAll('.view').forEach(view => {
            view.classList.add('hidden');
        });
        document.getElementById(viewId).classList.remove('hidden');
        window.scrollTo(0, 0);
    },

    // 渲染文章列表
    renderPosts(postsToRender = this.posts) {
        const grid = document.getElementById('postsGrid');
        const emptyState = document.getElementById('emptyState');

        if (postsToRender.length === 0) {
            grid.innerHTML = '';
            emptyState.classList.add('show');
            return;
        }

        emptyState.classList.remove('show');
        grid.innerHTML = postsToRender.map(post => this.createPostCard(post)).join('');

        // 绑定卡片点击事件
        grid.querySelectorAll('.post-card').forEach(card => {
            card.addEventListener('click', () => {
                this.viewPost(parseInt(card.dataset.id));
            });
        });
    },

    // 创建文章卡片 HTML
    createPostCard(post) {
        const date = new Date(post.createdAt).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        const excerpt = post.content.substring(0, 150) + (post.content.length > 150 ? '...' : '');
        const readingTime = Math.max(1, Math.ceil(post.content.length / 400));

        return `
            <article class="post-card" data-id="${post.id}">
                <h3 class="post-card-title">${this.escapeHtml(post.title)}</h3>
                <p class="post-card-excerpt">${this.escapeHtml(excerpt)}</p>
                <div class="post-card-meta">
                    <span>${date}</span>
                    <span>约 ${readingTime} 分钟阅读</span>
                </div>
            </article>
        `;
    },

    // 查看文章详情
    viewPost(id) {
        const post = this.posts.find(p => p.id === id);
        if (!post) return;

        this.currentPostId = id;
        post.views = (post.views || 0) + 1;
        this.savePosts();

        document.getElementById('postTitle').textContent = post.title;
        document.getElementById('postContent').textContent = post.content;

        const date = new Date(post.createdAt).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        document.getElementById('postDate').textContent = date;

        const readingTime = Math.max(1, Math.ceil(post.content.length / 400));
        document.getElementById('postReadingTime').textContent = `约 ${readingTime} 分钟阅读`;

        this.showView('postView');
    },

    // 编辑文章
    editPost(id) {
        const post = this.posts.find(p => p.id === id);
        if (!post) return;

        this.editingPostId = id;
        document.getElementById('editorTitle').value = post.title;
        document.getElementById('editorContent').value = post.content;
        this.updateTitleCount();
        this.updateWordCount();
        this.showView('editorView');
    },

    // 发布文章
    publishPost() {
        const title = document.getElementById('editorTitle').value.trim();
        const content = document.getElementById('editorContent').value.trim();

        if (!title) {
            this.showToast('请输入文章标题', 'error');
            document.getElementById('editorTitle').focus();
            return;
        }

        if (!content) {
            this.showToast('请输入文章内容', 'error');
            document.getElementById('editorContent').focus();
            return;
        }

        if (this.editingPostId) {
            // 更新现有文章
            const index = this.posts.findIndex(p => p.id === this.editingPostId);
            if (index !== -1) {
                this.posts[index].title = title;
                this.posts[index].content = content;
                this.posts[index].updatedAt = Date.now();
            }
            this.showToast('文章已更新', 'success');
        } else {
            // 创建新文章
            const newPost = {
                id: Date.now(),
                title,
                content,
                createdAt: Date.now(),
                views: 0
            };
            this.posts.unshift(newPost);
            this.showToast('文章发布成功', 'success');
        }

        this.savePosts();
        this.clearDraft();
        this.renderPosts();
        this.showView('homeView');
    },

    // 删除文章
    deletePost(id) {
        this.posts = this.posts.filter(p => p.id !== id);
        this.savePosts();
        this.renderPosts();
    },

    // 搜索文章
    searchPosts(query) {
        if (!query.trim()) {
            this.renderPosts();
            return;
        }

        const filtered = this.posts.filter(post =>
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.content.toLowerCase().includes(query.toLowerCase())
        );
        this.renderPosts(filtered);
    },

    // 筛选文章
    filterPosts(filter) {
        let sorted = [...this.posts];
        switch (filter) {
            case 'popular':
                sorted.sort((a, b) => (b.views || 0) - (a.views || 0));
                break;
            case 'recent':
                sorted.sort((a, b) => b.createdAt - a.createdAt);
                break;
            default:
            // 全部保持默认顺序
        }
        this.renderPosts(sorted);
    },

    // 更新标题字数
    updateTitleCount() {
        const count = document.getElementById('editorTitle').value.length;
        document.getElementById('titleCount').textContent = count;
    },

    // 更新内容字数
    updateWordCount() {
        const content = document.getElementById('editorContent').value;
        const count = content.replace(/\s/g, '').length;
        document.getElementById('wordCount').textContent = count;
    },

    // 保存草稿
    saveDraft() {
        clearTimeout(this.draftSaveTimer);
        this.draftSaveTimer = setTimeout(() => {
            const draft = {
                title: document.getElementById('editorTitle').value,
                content: document.getElementById('editorContent').value,
                savedAt: Date.now()
            };
            localStorage.setItem('xishi_draft', JSON.stringify(draft));
            document.getElementById('autoSaveStatus').textContent = '草稿已自动保存';
        }, 1000);
    },

    // 加载草稿
    loadDraft() {
        const draft = localStorage.getItem('xishi_draft');
        if (draft) {
            const { title, content } = JSON.parse(draft);
            if (title || content) {
                document.getElementById('editorTitle').value = title || '';
                document.getElementById('editorContent').value = content || '';
                this.updateTitleCount();
                this.updateWordCount();
            }
        }
    },

    // 清除草稿
    clearDraft() {
        localStorage.removeItem('xishi_draft');
    },

    // 显示 Toast 通知
    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('toast-out');
            setTimeout(() => toast.remove(), 250);
        }, 3000);
    },

    // HTML 转义
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
