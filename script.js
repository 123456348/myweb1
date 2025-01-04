document.addEventListener('DOMContentLoaded', function() {
    // 获取所有需要的元素
    const editButton = document.getElementById('editButton');
    const closeEdit = document.getElementById('closeEdit');
    const infoEdit = document.getElementById('infoEdit');
    const overlay = document.getElementById('overlay');

    // 显示编辑区域
    editButton.addEventListener('click', function() {
        infoEdit.classList.add('show');
        overlay.classList.add('show');
    });

    // 隐藏编辑区域
    function hideEdit() {
        infoEdit.classList.remove('show');
        overlay.classList.remove('show');
    }

    // 关闭按钮点击事件
    closeEdit.addEventListener('click', hideEdit);

    // 点击遮罩层关闭编辑区域
    overlay.addEventListener('click', hideEdit);

    // 表单提交处理
    const infoForm = document.getElementById('infoForm');
    infoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(infoForm);
        const data = Object.fromEntries(formData);
        
        // 更新显示的信息
        updateDisplayInfo(data);
        
        // 清空表单并隐藏编辑区域
        infoForm.reset();
        hideEdit();
    });

    // 项目添加功能
    const addProjectBtn = document.getElementById('addProject');
    const projectList = document.getElementById('projectList');
    
    addProjectBtn.addEventListener('click', function() {
        const projectDiv = document.createElement('div');
        projectDiv.className = 'project-item';
        projectDiv.innerHTML = `
            <input type="text" placeholder="项目名称">
            <textarea placeholder="项目描述"></textarea>
            <input type="url" placeholder="项目链接">
            <button class="save-project">保存</button>
            <button class="delete-project">删除</button>
        `;
        
        projectList.appendChild(projectDiv);
    });

    // 委托处理项目的保存和删除
    projectList.addEventListener('click', function(e) {
        if (e.target.classList.contains('save-project')) {
            const projectItem = e.target.parentElement;
            const inputs = projectItem.querySelectorAll('input, textarea');
            const projectData = Array.from(inputs).reduce((acc, input) => {
                acc[input.placeholder] = input.value;
                return acc;
            }, {});
            
            // 这里可以添加保存到本地存储或发送到服务器的逻辑
            console.log('保存项目:', projectData);
        }
        
        if (e.target.classList.contains('delete-project')) {
            e.target.parentElement.remove();
        }
    });

    // 添加邮件发送功能
    document.getElementById('emailForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const subject = document.getElementById('emailSubject').value;
        const message = this.querySelector('textarea').value;
        const mailtoLink = `mailto:351744595@qq.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
        window.location.href = mailtoLink;
    });

    // 代码分享功能
    const shareCodeBtn = document.getElementById('shareCode');
    const sharedCodes = document.getElementById('sharedCodes');

    // 代码分享功能增强
    let codeHistory = [];

    shareCodeBtn.addEventListener('click', function() {
        const code = document.getElementById('codeInput').value;
        const language = document.getElementById('languageSelect').value;
        
        if (code.trim()) {
            const codeData = {
                code: code,
                language: language,
                timestamp: new Date().toLocaleString()
            };
            
            // 保存到历史记录
            codeHistory.push(codeData);
            
            // 更新显示的代码
            updateSharedCode(codeData);
            
            // 清空输入
            document.getElementById('codeInput').value = '';
        }
    });

    // 查看历史代码
    document.getElementById('viewHistory').addEventListener('click', function() {
        const historyDiv = document.getElementById('codeHistory');
        const overlay = document.getElementById('overlay');
        
        historyDiv.innerHTML = `
            <button class="close-history">&times;</button>
            ${codeHistory.map((data, index) => `
                <div class="code-block" data-index="${index}">
                    <div class="code-header">
                        <span>${data.language}</span>
                        <span>${data.timestamp}</span>
                    </div>
                    <textarea class="code-content">${data.code}</textarea>
                    <div class="code-actions">
                        <button class="update-code">更新</button>
                        <button class="delete-code">删除</button>
                    </div>
                </div>
            `).join('')}
        `;
        
        historyDiv.classList.add('show');
        overlay.classList.add('show');

        // 添加关闭按钮事件
        const closeBtn = historyDiv.querySelector('.close-history');
        closeBtn.addEventListener('click', function() {
            historyDiv.classList.remove('show');
            overlay.classList.remove('show');
        });

        // 处理更新和删除操作
        historyDiv.addEventListener('click', function(e) {
            if (e.target.classList.contains('update-code')) {
                const codeBlock = e.target.closest('.code-block');
                const index = parseInt(codeBlock.dataset.index);
                const newCode = codeBlock.querySelector('.code-content').value;
                
                // 更新历史记录
                codeHistory[index].code = newCode;
                codeHistory[index].timestamp = new Date().toLocaleString();
                
                // 更新显示的代码
                updateSharedCode(codeHistory[index]);
                
                // 关闭历史窗口
                historyDiv.classList.remove('show');
                overlay.classList.remove('show');
            }
            
            if (e.target.classList.contains('delete-code')) {
                const codeBlock = e.target.closest('.code-block');
                const index = parseInt(codeBlock.dataset.index);
                
                // 从历史记录中删除
                codeHistory.splice(index, 1);
                
                // 如果还有代码，显示最新的
                if (codeHistory.length > 0) {
                    updateSharedCode(codeHistory[codeHistory.length - 1]);
                } else {
                    document.getElementById('sharedCodes').innerHTML = '';
                }
                
                // 重新渲染历史记录
                codeBlock.remove();
            }
        });
    });

    // 防止历史记录窗口的点击事件传播到遮罩层
    document.getElementById('codeHistory').addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // 更新显示的代码
    function updateSharedCode(codeData) {
        const sharedCodes = document.getElementById('sharedCodes');
        sharedCodes.innerHTML = `
            <div class="code-block">
                <div class="code-header">
                    <span>${codeData.language}</span>
                    <span>${codeData.timestamp}</span>
                </div>
                <textarea class="code-content" readonly>${codeData.code}</textarea>
            </div>
        `;
    }

    // 评论功能
    const submitCommentBtn = document.getElementById('submitComment');
    const commentsList = document.getElementById('commentsList');

    submitCommentBtn.addEventListener('click', function() {
        const name = document.getElementById('commentName').value;
        const content = document.getElementById('commentContent').value;
        
        if (name.trim() && content.trim()) {
            const comment = document.createElement('div');
            comment.className = 'comment';
            comment.innerHTML = `
                <div class="comment-header">
                    <span>${name}</span>
                    <span>${new Date().toLocaleString()}</span>
                </div>
                <div class="comment-content">${content}</div>
            `;
            commentsList.insertBefore(comment, commentsList.firstChild);
            
            // 清空输入
            document.getElementById('commentName').value = '';
            document.getElementById('commentContent').value = '';
        }
    });
});

function updateDisplayInfo(data) {
    // 创建数据映射关系
    const dataMapping = {
        'name': '姓名',
        'phone': '电话',
        'email': '邮箱',
        'birth': '出生日期',
        'address': '地址',
        'country': '国家'
    };

    const infoItems = document.querySelectorAll('.info-item');
    infoItems.forEach(item => {
        const dataLabel = item.getAttribute('data-label');
        const content = item.querySelector('.content');
        
        // 根据映射找到对应的表单数据
        const formField = Object.keys(dataMapping).find(key => dataMapping[key] === dataLabel);
        if (formField && data[formField]) {
            content.textContent = data[formField];
        }
    });
} 