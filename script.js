document.addEventListener('DOMContentLoaded', function() {
    // ��ȡ������Ҫ��Ԫ��
    const editButton = document.getElementById('editButton');
    const closeEdit = document.getElementById('closeEdit');
    const infoEdit = document.getElementById('infoEdit');
    const overlay = document.getElementById('overlay');

    // ��ʾ�༭����
    editButton.addEventListener('click', function() {
        infoEdit.classList.add('show');
        overlay.classList.add('show');
    });

    // ���ر༭����
    function hideEdit() {
        infoEdit.classList.remove('show');
        overlay.classList.remove('show');
    }

    // �رհ�ť����¼�
    closeEdit.addEventListener('click', hideEdit);

    // ������ֲ�رձ༭����
    overlay.addEventListener('click', hideEdit);

    // ���ύ����
    const infoForm = document.getElementById('infoForm');
    infoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(infoForm);
        const data = Object.fromEntries(formData);
        
        // ������ʾ����Ϣ
        updateDisplayInfo(data);
        
        // ��ձ������ر༭����
        infoForm.reset();
        hideEdit();
    });

    // ��Ŀ��ӹ���
    const addProjectBtn = document.getElementById('addProject');
    const projectList = document.getElementById('projectList');
    
    addProjectBtn.addEventListener('click', function() {
        const projectDiv = document.createElement('div');
        projectDiv.className = 'project-item';
        projectDiv.innerHTML = `
            <input type="text" placeholder="��Ŀ����">
            <textarea placeholder="��Ŀ����"></textarea>
            <input type="url" placeholder="��Ŀ����">
            <button class="save-project">����</button>
            <button class="delete-project">ɾ��</button>
        `;
        
        projectList.appendChild(projectDiv);
    });

    // ί�д�����Ŀ�ı����ɾ��
    projectList.addEventListener('click', function(e) {
        if (e.target.classList.contains('save-project')) {
            const projectItem = e.target.parentElement;
            const inputs = projectItem.querySelectorAll('input, textarea');
            const projectData = Array.from(inputs).reduce((acc, input) => {
                acc[input.placeholder] = input.value;
                return acc;
            }, {});
            
            // ���������ӱ��浽���ش洢���͵����������߼�
            console.log('������Ŀ:', projectData);
        }
        
        if (e.target.classList.contains('delete-project')) {
            e.target.parentElement.remove();
        }
    });

    // ����ʼ����͹���
    document.getElementById('emailForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const subject = document.getElementById('emailSubject').value;
        const message = this.querySelector('textarea').value;
        const mailtoLink = `mailto:351744595@qq.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
        window.location.href = mailtoLink;
    });

    // ���������
    const shareCodeBtn = document.getElementById('shareCode');
    const sharedCodes = document.getElementById('sharedCodes');

    // �����������ǿ
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
            
            // ���浽��ʷ��¼
            codeHistory.push(codeData);
            
            // ������ʾ�Ĵ���
            updateSharedCode(codeData);
            
            // �������
            document.getElementById('codeInput').value = '';
        }
    });

    // �鿴��ʷ����
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
                        <button class="update-code">����</button>
                        <button class="delete-code">ɾ��</button>
                    </div>
                </div>
            `).join('')}
        `;
        
        historyDiv.classList.add('show');
        overlay.classList.add('show');

        // ��ӹرհ�ť�¼�
        const closeBtn = historyDiv.querySelector('.close-history');
        closeBtn.addEventListener('click', function() {
            historyDiv.classList.remove('show');
            overlay.classList.remove('show');
        });

        // ������º�ɾ������
        historyDiv.addEventListener('click', function(e) {
            if (e.target.classList.contains('update-code')) {
                const codeBlock = e.target.closest('.code-block');
                const index = parseInt(codeBlock.dataset.index);
                const newCode = codeBlock.querySelector('.code-content').value;
                
                // ������ʷ��¼
                codeHistory[index].code = newCode;
                codeHistory[index].timestamp = new Date().toLocaleString();
                
                // ������ʾ�Ĵ���
                updateSharedCode(codeHistory[index]);
                
                // �ر���ʷ����
                historyDiv.classList.remove('show');
                overlay.classList.remove('show');
            }
            
            if (e.target.classList.contains('delete-code')) {
                const codeBlock = e.target.closest('.code-block');
                const index = parseInt(codeBlock.dataset.index);
                
                // ����ʷ��¼��ɾ��
                codeHistory.splice(index, 1);
                
                // ������д��룬��ʾ���µ�
                if (codeHistory.length > 0) {
                    updateSharedCode(codeHistory[codeHistory.length - 1]);
                } else {
                    document.getElementById('sharedCodes').innerHTML = '';
                }
                
                // ������Ⱦ��ʷ��¼
                codeBlock.remove();
            }
        });
    });

    // ��ֹ��ʷ��¼���ڵĵ���¼����������ֲ�
    document.getElementById('codeHistory').addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // ������ʾ�Ĵ���
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

    // ���۹���
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
            
            // �������
            document.getElementById('commentName').value = '';
            document.getElementById('commentContent').value = '';
        }
    });
});

function updateDisplayInfo(data) {
    // ��������ӳ���ϵ
    const dataMapping = {
        'name': '����',
        'phone': '�绰',
        'email': '����',
        'birth': '��������',
        'address': '��ַ',
        'country': '����'
    };

    const infoItems = document.querySelectorAll('.info-item');
    infoItems.forEach(item => {
        const dataLabel = item.getAttribute('data-label');
        const content = item.querySelector('.content');
        
        // ����ӳ���ҵ���Ӧ�ı�����
        const formField = Object.keys(dataMapping).find(key => dataMapping[key] === dataLabel);
        if (formField && data[formField]) {
            content.textContent = data[formField];
        }
    });
} 