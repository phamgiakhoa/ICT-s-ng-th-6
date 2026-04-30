// ----- KHỞI TẠO: không có dữ liệu giả lập -----
let exercises = [];

// Load từ localStorage (nếu có)
function loadFromStorage() {
    const stored = localStorage.getItem('fitVidLab_exercises');
    if (stored) {
        exercises = JSON.parse(stored);
    } else {
        // DỮ LIỆU GIẢ MẪU (bạn có thể dễ dàng sửa hoặc xóa sau)
        exercises = [
            {
                id: 1001,
                title: "Video Tuyển Sinh",
                videoUrl: "https://youtu.be/XS6s9emKLAI?si=OvLWOcLCDja2pX4l",
                imageUrl: "logo.png"
            },
            {
                id: 1002,
                title: "Digital Video 1",
                videoUrl: "video/digital_video1.mp4",
                imageUrl: "logo.png"
            },
            {
                id: 1003,
                title: "Digital Video 2",
                videoUrl: "video/digital_video2.mp4",
                imageUrl: "logo.png"
            },
            {
                id: 1004,
                title: "English Lession Slides",
                videoUrl: "https://canva.link/emjw6psyvigosit",
                imageUrl: "logo.png"
            },
            {
                id: 1004,
                title: "Note Book LM",
                videoUrl: "https://notebooklm.google.com/notebook/d63b967d-40fc-45d9-8b12-f82b488fa87e?pli=1",
                imageUrl: "logo.png"
            }
        ];
        // Lưu ngay vào localStorage để lần sau không tạo lại
        localStorage.setItem('fitVidLab_exercises', JSON.stringify(exercises));
    }
    updateBadgeCount();
    renderExercises();
}
function saveToStorage() {
    localStorage.setItem('fitVidLab_exercises', JSON.stringify(exercises));
    // Mỗi khi lưu, ta sẽ gọi hiệu ứng flash màu status (nếu là thêm/xóa/sửa gây ra lưu)
    flashStatusColor();
}

function updateBadgeCount() {
    const countSpan = document.getElementById('itemCount');
    if (countSpan) countSpan.innerText = exercises.length + ' bài';
}

// Hiệu ứng màu chữ cạnh logo chuyển sang darkgray & black
function flashStatusColor() {
    const statusEl = document.getElementById('storageStatus');
    if (!statusEl) return;
    // Thêm class tạm thời để đổi màu nền darkgray và chữ black
    statusEl.classList.add('status-highlight');
    setTimeout(() => {
        statusEl.classList.remove('status-highlight');
    }, 600);
}

// Helper xử lý YouTube
function getYoutubeEmbedUrl(url) {
    if (!url) return null;
    const pattern = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(pattern);
    if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1`;
    }
    return null;
}

function generateVideoHTML(videoUrl) {
    if (!videoUrl) {
        return `<div class="video-container" style="background:#f0f2f5; display:flex; align-items:center; justify-content:center; color:#888;">⚠️ Chưa có link video</div>`;
    }

    // Xử lý YouTube
    const youtubeEmbed = getYoutubeEmbedUrl(videoUrl);
    if (youtubeEmbed) {
        return `<div class="video-container">
                    <iframe src="${youtubeEmbed}" frameborder="0" allowfullscreen></iframe>
                </div>`;
    }

    // Đối với file video (mp4, webm, mov, ...) - bao gồm đường dẫn tương đối và tuyệt đối http
    // Kiểm tra nếu có đuôi video hoặc không phải youtube thì dùng thẻ video
    return `<div class="video-container">
                <video controls preload="metadata" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <source src="${videoUrl}" type="video/mp4">
                    Trình duyệt không hỗ trợ video.
                </video>
                <div style="display:none; align-items:center; justify-content:center; background:#f8d7da; color:#721c24; height:100%; width:100%; text-align:center; padding:1rem;">
                    <i class="fas fa-exclamation-triangle"></i> Không thể tải video. Kiểm tra:<br>
                    - Đường dẫn: <strong>${escapeHtml(videoUrl)}</strong><br>
                    - Bạn đã chạy bằng Live Server chưa?<br>
                    - File có tồn tại không?
                </div>
            </div>`;
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function truncateUrl(url, max) {
    if (!url) return '';
    return url.length > max ? url.slice(0, max) + '…' : url;
}

function renderExercises() {
    const container = document.getElementById('exercisesContainer');
    if (!container) return;
    if (exercises.length === 0) {
        container.innerHTML = `<div class="empty-message" style="text-align:center; padding:3rem; background:#fff; border-radius:2rem;">
            <i class="fas fa-folder-open" style="font-size:3rem; opacity:0.5;"></i>
            <h3>Chưa có bài tập nào</h3>
            <p>Hãy sử dụng form bên dưới để thêm video và ảnh đầu tiên nhé!</p>
        </div>`;
        return;
    }
    let html = '';
    exercises.forEach(ex => {
        const videoHtml = generateVideoHTML(ex.videoUrl);
        const imageHtml = `<div class="image-container"><img class="exercise-img" src="${ex.imageUrl}" alt="${escapeHtml(ex.title)}" onerror="this.src='https://placehold.co/600x400?text=Ảnh+lỗi'"></div>`;
        html += `
            <div class="exercise-card" data-id="${ex.id}">
                ${videoHtml}
                ${imageHtml}
                <div class="card-content">
                    <div class="card-title">
                        <span> ${escapeHtml(ex.title)}</span>
                    </div>
                    <div class="link-info">
                        <i class="fas fa-link"></i> <strong>Video link:</strong> 
                        <a href="${ex.videoUrl}" target="_blank">${truncateUrl(ex.videoUrl, 55)}</a>
                    </div>
                    <div class="link-info">
                        <i class="fas fa-image"></i> <strong>Ảnh link:</strong> 
                        <a href="${ex.imageUrl}" target="_blank">${truncateUrl(ex.imageUrl, 55)}</a>
                    </div>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
    
    // Gắn sự kiện edit/delete
    
    updateBadgeCount();
}



function resetFormToAddMode() {
    document.getElementById('editId').value = '';
    document.getElementById('exerciseForm').reset();
    document.getElementById('formTitleText').innerHTML = '➕ Thêm bài tập mới';
    document.getElementById('cancelEditBtn').style.display = 'none';
}

function saveOrUpdateExercise(title, videoUrl, imageUrl, editId) {
    if (!title.trim() || !videoUrl.trim() || !imageUrl.trim()) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return false;
    }
    try {
        new URL(videoUrl);
        new URL(imageUrl);
    } catch (e) {
        alert('Đường dẫn video hoặc ảnh không hợp lệ (cần http:// hoặc https://)');
        return false;
    }
    if (editId) {
        // UPDATE
        const index = exercises.findIndex(ex => ex.id === parseInt(editId));
        if (index !== -1) {
            exercises[index] = {
                id: parseInt(editId),
                title: title.trim(),
                videoUrl: videoUrl.trim(),
                imageUrl: imageUrl.trim()
            };
        }
    } 
    saveToStorage();   // Lưu -> trong saveToStorage có gọi flashStatusColor()
    renderExercises();
    resetFormToAddMode();
    return true;
}

// Form submit


// Hủy sửa


// Khởi động
loadFromStorage();