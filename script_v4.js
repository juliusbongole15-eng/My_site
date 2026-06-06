// ===== ADMIN AUTHENTICATION =====
const ADMIN_PASSWORD = "Daniel2024"; // Change this to your secure password
let isAdminLoggedIn = false;

// ===== ADMIN LOGIN =====
function openAdminLoginModal() {
    if (isAdminLoggedIn) {
        openUploadModal();
        return;
    }
    const modal = document.getElementById('adminLoginModal');
    modal.classList.add('show');
}

function closeAdminLoginModal() {
    const modal = document.getElementById('adminLoginModal');
    modal.classList.remove('show');
    document.getElementById('adminLoginForm').reset();
    document.getElementById('adminPasswordError').textContent = '';
}

function handleAdminLogin(e) {
    e.preventDefault();
    const password = document.getElementById('adminPassword').value;
    const errorElement = document.getElementById('adminPasswordError');

    if (password === ADMIN_PASSWORD) {
        isAdminLoggedIn = true;
        closeAdminLoginModal();
        openUploadModal();
        updateAdminUI();
        showFormMessage('success', '✅ Admin mode activated! You can now upload projects.');
    } else {
        errorElement.textContent = '❌ Incorrect password';
        errorElement.style.color = '#e74c3c';
    }
}

function logoutAdmin() {
    if (confirm('Are you sure you want to logout?')) {
        isAdminLoggedIn = false;
        closeUploadModal();
        updateAdminUI();
        showFormMessage('success', '✅ Logged out from admin mode');
    }
}

function updateAdminUI() {
    const uploadBtn = document.getElementById('uploadAdminBtn');
    const statusMsg = document.getElementById('adminStatusMsg');
    
    if (isAdminLoggedIn) {
        uploadBtn.innerHTML = '✅ Admin Mode: Upload Projects';
        uploadBtn.style.background = 'linear-gradient(135deg, var(--success-color) 0%, #1e8449 100%)';
        statusMsg.style.display = 'block';
    } else {
        uploadBtn.innerHTML = '🔐 Admin: Upload New Project';
        uploadBtn.style.background = '';
        statusMsg.style.display = 'none';
    }
}

// ===== CHECK ADMIN STATUS ON PAGE LOAD =====
window.addEventListener('load', function() {
    updateAdminUI();
    loadProjects();
    loadUploadedProjects();
});
const FILE_TYPES = {
    image: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'],
    document: ['pdf', 'doc', 'docx', 'txt', 'xlsx', 'xls', 'ppt', 'pptx'],
    code: ['html', 'css', 'js', 'php', 'py', 'java', 'cpp', 'c', 'sql', 'json'],
    video: ['mp4', 'avi', 'mov', 'mkv', 'webm'],
    network: ['xml', 'json', 'yaml', 'yml', 'conf', 'config'],
    database: ['sql', 'db', 'sqlite', 'mdb', 'csv'],
    archive: ['zip', 'rar', '7z', 'tar', 'gz']
};

const FILE_ICONS = {
    image: '🖼️',
    document: '📄',
    code: '💻',
    video: '🎥',
    network: '🌐',
    database: '🗄️',
    archive: '📦',
    default: '📁'
};

// ===== FILE UPLOAD STATE =====
let selectedFiles = [];

// ===== GET FILE TYPE =====
function getFileType(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    
    for (const [type, extensions] of Object.entries(FILE_TYPES)) {
        if (extensions.includes(ext)) {
            return type;
        }
    }
    return 'default';
}

// ===== GET FILE ICON =====
function getFileIcon(fileType) {
    return FILE_ICONS[fileType] || FILE_ICONS.default;
}

// ===== FILE SIZE FORMAT =====
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// ===== OPEN UPLOAD MODAL =====
function openUploadModal() {
    if (!isAdminLoggedIn) {
        openAdminLoginModal();
        return;
    }
    const modal = document.getElementById('uploadModal');
    modal.classList.add('show');
    selectedFiles = [];
    updateFilePreview();
}

// ===== CLOSE UPLOAD MODAL =====
function closeUploadModal() {
    const modal = document.getElementById('uploadModal');
    modal.classList.remove('show');
    selectedFiles = [];
    document.getElementById('fileUploadForm').reset();
    updateFilePreview();
    // Don't logout automatically - keep admin session active
}

// ===== FILE INPUT HANDLING =====
const fileInput = document.getElementById('fileInput');
const fileUploadArea = document.getElementById('fileUploadArea');

// Click to upload
fileUploadArea.addEventListener('click', () => fileInput.click());

// File selection
fileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    addFiles(files);
});

// Drag and drop
fileUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileUploadArea.classList.add('dragover');
});

fileUploadArea.addEventListener('dragleave', () => {
    fileUploadArea.classList.remove('dragover');
});

fileUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    fileUploadArea.classList.remove('dragover');
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
});

// ===== ADD FILES =====
function addFiles(files) {
    files.forEach(file => {
        const fileType = getFileType(file.name);
        selectedFiles.push({
            name: file.name,
            size: file.size,
            type: fileType,
            file: file,
            id: Date.now() + Math.random()
        });
    });
    updateFilePreview();
}

// ===== UPDATE FILE PREVIEW =====
function updateFilePreview() {
    const container = document.getElementById('filePreviewContainer');
    container.innerHTML = '';

    if (selectedFiles.length === 0) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'grid';

    selectedFiles.forEach(fileData => {
        const preview = document.createElement('div');
        preview.className = 'file-preview-item';
        preview.innerHTML = `
            <div class="file-preview-icon">${getFileIcon(fileData.type)}</div>
            <div class="file-preview-name">${fileData.name}</div>
            <div style="font-size: 0.7rem; color: #999; margin-bottom: 8px;">${formatFileSize(fileData.size)}</div>
            <button type="button" class="file-remove-btn" onclick="removeFile('${fileData.id}')">✕</button>
        `;
        container.appendChild(preview);
    });
}

// ===== REMOVE FILE =====
function removeFile(fileId) {
    selectedFiles = selectedFiles.filter(f => f.id !== fileId);
    updateFilePreview();
}

// ===== FILE UPLOAD FORM SUBMISSION =====
const fileUploadForm = document.getElementById('fileUploadForm');

fileUploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate
    let isValid = true;
    const projectName = document.getElementById('projectName').value;
    const projectCategory = document.getElementById('projectCategory').value;
    const projectDescription = document.getElementById('projectDescription').value;

    if (!projectName.trim() || projectName.length < 2) {
        document.getElementById('projectNameError').textContent = 'Project name required (min 2 characters)';
        isValid = false;
    } else {
        document.getElementById('projectNameError').textContent = '';
    }

    if (!projectCategory) {
        document.getElementById('projectCategoryError').textContent = 'Category required';
        isValid = false;
    } else {
        document.getElementById('projectCategoryError').textContent = '';
    }

    if (!projectDescription.trim() || projectDescription.length < 5) {
        document.getElementById('projectDescriptionError').textContent = 'Description required (min 5 characters)';
        isValid = false;
    } else {
        document.getElementById('projectDescriptionError').textContent = '';
    }

    if (selectedFiles.length === 0) {
        document.getElementById('fileError').textContent = 'Please upload at least one file';
        isValid = false;
    } else {
        document.getElementById('fileError').textContent = '';
    }

    if (!isValid) return;

    // Show loading
    const uploadBtn = document.getElementById('uploadSubmitBtn');
    uploadBtn.disabled = true;
    document.querySelector('#uploadSubmitBtn .btn-text').textContent = 'Uploading...';
    document.getElementById('uploadSpinner').style.display = 'block';

    // Simulate upload delay
    setTimeout(() => {
        // Create project object
        const newProject = {
            id: Date.now(),
            title: projectName,
            category: projectCategory,
            description: projectDescription,
            image: getGradientForCategory(projectCategory),
            files: selectedFiles.map(f => ({
                name: f.name,
                type: f.type,
                size: f.size,
                icon: getFileIcon(f.type)
            })),
            timestamp: new Date().toLocaleString('sw-TZ'),
            isUserProject: true
        };

        // Save to localStorage
        let userProjects = JSON.parse(localStorage.getItem('userProjects')) || [];
        userProjects.push(newProject);
        localStorage.setItem('userProjects', JSON.stringify(userProjects));

        // Show success
        showFormMessage('success', `✅ Project "${projectName}" uploaded successfully!`);

        // Reset form
        fileUploadForm.reset();
        selectedFiles = [];
        updateFilePreview();

        // Update project list
        loadUploadedProjects();
        loadProjects();

        // Close modal after delay
        setTimeout(() => {
            closeUploadModal();
        }, 1500);

        // Reset button
        uploadBtn.disabled = false;
        document.querySelector('#uploadSubmitBtn .btn-text').textContent = 'Upload Project';
        document.getElementById('uploadSpinner').style.display = 'none';
    }, 1500);
});

// ===== GET GRADIENT FOR CATEGORY =====
function getGradientForCategory(category) {
    const gradients = {
        'Web Development': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'Database System': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'Network Design': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        'Graphics Design': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'Mobile App': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'System Admin': 'linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)'
    };
    return gradients[category] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
}

// ===== LOAD UPLOADED PROJECTS =====
function loadUploadedProjects() {
    const userProjects = JSON.parse(localStorage.getItem('userProjects')) || [];
    const container = document.getElementById('uploadedProjectsList');
    
    container.innerHTML = '';

    if (userProjects.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999; padding: 40px;">No projects uploaded yet. Click "Upload New Project" to get started!</p>';
        return;
    }

    userProjects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'uploaded-project-card';
        card.innerHTML = `
            <div class="uploaded-project-header">
                <div>
                    <div class="uploaded-project-title">${project.title}</div>
                    <div class="uploaded-project-tag">${project.category}</div>
                </div>
                <button type="button" class="uploaded-project-delete" onclick="deleteProject(${project.id})">🗑️</button>
            </div>
            <div class="uploaded-project-desc">${project.description}</div>
            <div class="uploaded-project-files">
                <label class="uploaded-project-files-label">Files:</label>
                <span class="uploaded-files-count">${project.files.length} file(s)</span>
            </div>
        `;
        card.addEventListener('click', () => {
            openProjectModalForUpload(project);
        });
        container.appendChild(card);
    });
}

// ===== DELETE PROJECT =====
function deleteProject(projectId) {
    if (confirm('Are you sure you want to delete this project?')) {
        let userProjects = JSON.parse(localStorage.getItem('userProjects')) || [];
        userProjects = userProjects.filter(p => p.id !== projectId);
        localStorage.setItem('userProjects', JSON.stringify(userProjects));
        loadUploadedProjects();
        loadProjects();
    }
}

// ===== OPEN PROJECT MODAL FOR UPLOADED PROJECT =====
function openProjectModalForUpload(project) {
    const modal = document.getElementById('projectModal');
    
    document.getElementById('projectModalTitle').textContent = project.title;
    document.getElementById('projectModalDesc').textContent = project.description;
    document.getElementById('projectModalObjective').textContent = `Uploaded on ${project.timestamp}`;
    document.querySelector('.project-modal-tag').textContent = project.category;
    document.querySelector('.project-modal-image').style.background = project.image;

    // Technologies
    const techContainer = document.getElementById('projectModalTech');
    const fileTypes = [...new Set(project.files.map(f => f.type))];
    techContainer.innerHTML = fileTypes.map(type => `<span>${type.toUpperCase()}</span>`).join('');

    // Files
    const filesList = document.getElementById('projectModalFiles');
    filesList.innerHTML = project.files.map(file => `
        <div class="file-item">
            <span class="file-item-icon">${file.icon}</span>
            <span>${file.name} (${formatFileSize(file.size)})</span>
        </div>
    `).join('');

    modal.classList.add('show');
}

// ===== PROJECTS DATA =====
const projectsData = [
    {
        id: 1,
        title: "E-Commerce Platform",
        tag: "Web Development",
        description: "A full-stack e-commerce solution with payment integration, inventory management, and user dashboard.",
        image: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        objective: "Build a complete online store with secure payment processing and real-time inventory tracking.",
        technologies: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
        files: [
            { name: "index.html", icon: "📄", type: "code", size: 25000 },
            { name: "style.css", icon: "📄", type: "code", size: 15000 },
            { name: "database.sql", icon: "🗄️", type: "database", size: 50000 }
        ],
        link: "#"
    },
    {
        id: 2,
        title: "Mobile App Design",
        tag: "UI/UX Design",
        description: "User-centered mobile app design with wireframes, prototypes, and interactive mockups for a fitness platform.",
        image: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        objective: "Create an intuitive fitness tracking app with beautiful UI and excellent user experience.",
        technologies: ["Figma", "UI Design", "Prototyping", "User Research"],
        files: [
            { name: "mockup.png", icon: "🖼️", type: "image", size: 500000 },
            { name: "prototype.fig", icon: "📁", type: "document", size: 2000000 }
        ],
        link: "#"
    },
    {
        id: 3,
        title: "Student Management System",
        tag: "Database System",
        description: "Complete student information system with database design, authentication, and comprehensive reporting features.",
        image: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        objective: "Develop a comprehensive system for managing student records, grades, and attendance.",
        technologies: ["MySQL", "PHP", "JavaScript", "Database Design"],
        files: [
            { name: "schema.sql", icon: "🗄️", type: "database", size: 75000 },
            { name: "queries.sql", icon: "🗄️", type: "database", size: 100000 },
            { name: "admin_panel.php", icon: "💻", type: "code", size: 80000 }
        ],
        link: "#"
    },
    {
        id: 4,
        title: "Brand Identity",
        tag: "Graphics Design",
        description: "Complete brand design package including logo, color palette, typography, and brand guidelines.",
        image: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
        objective: "Create a cohesive visual identity that represents the brand's values and appeals to target audience.",
        technologies: ["Adobe Design", "Branding", "Typography"],
        files: [
            { name: "logo.svg", icon: "🎨", type: "image", size: 150000 },
            { name: "brand_guide.pdf", icon: "📄", type: "document", size: 3000000 }
        ],
        link: "#"
    },
    {
        id: 5,
        title: "Network Configuration",
        tag: "Network Design",
        description: "Enterprise network setup with VLAN configuration, security protocols, and network optimization.",
        image: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
        objective: "Design and implement a secure, scalable enterprise network infrastructure.",
        technologies: ["Cisco", "Network Design", "Security"],
        files: [
            { name: "network_layout.xml", icon: "🌐", type: "network", size: 200000 },
            { name: "vlan_config.conf", icon: "⚙️", type: "network", size: 50000 }
        ],
        link: "#"
    },
    {
        id: 6,
        title: "Content Management System",
        tag: "Full Stack",
        description: "Custom CMS with user authentication, content management, analytics, and SEO optimization tools.",
        image: "linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)",
        objective: "Build an easy-to-use platform for managing website content and monitoring performance metrics.",
        technologies: ["PHP", "JavaScript", "MySQL"],
        files: [
            { name: "cms_core.php", icon: "💻", type: "code", size: 120000 },
            { name: "database_backup.sql", icon: "🗄️", type: "database", size: 500000 }
        ],
        link: "#"
    }
];

// ===== LOAD ALL PROJECTS =====
function loadProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    projectsGrid.innerHTML = '';

    // Get user projects
    const userProjects = JSON.parse(localStorage.getItem('userProjects')) || [];

    // Combine sample and user projects
    const allProjects = [...projectsData, ...userProjects];

    // Update project count
    document.getElementById('projectCount').textContent = allProjects.length + '+';

    allProjects.forEach((project, index) => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.innerHTML = `
            <div class="project-image" style="background: ${project.image};">
                <div class="project-overlay">
                    <button class="project-btn" onclick="openProjectModal(${index}, ${project.isUserProject ? 'true' : 'false'})">View Project</button>
                </div>
            </div>
            <div class="project-content">
                <div class="project-tag">${project.tag || project.category}</div>
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tech">
                    ${(project.technologies || project.files.map(f => f.type.toUpperCase())).map(tech => `<span>${tech}</span>`).join('')}
                </div>
            </div>
        `;
        projectsGrid.appendChild(projectCard);
        
        setTimeout(() => {
            projectCard.style.animation = `slideInUp 0.6s ease-out forwards`;
        }, index * 100);
    });
}

// ===== OPEN PROJECT MODAL =====
function openProjectModal(projectIndex, isUserProject = false) {
    const userProjects = JSON.parse(localStorage.getItem('userProjects')) || [];
    const allProjects = [...projectsData, ...userProjects];
    const project = allProjects[projectIndex];

    if (!project) return;

    const modal = document.getElementById('projectModal');
    
    document.getElementById('projectModalTitle').textContent = project.title;
    document.getElementById('projectModalDesc').textContent = project.description;
    document.getElementById('projectModalObjective').textContent = project.objective || project.description;
    document.querySelector('.project-modal-tag').textContent = project.tag || project.category;
    document.querySelector('.project-modal-image').style.background = project.image;

    // Technologies
    const techContainer = document.getElementById('projectModalTech');
    const techs = project.technologies || project.files.map(f => f.type.toUpperCase());
    techContainer.innerHTML = techs.map(tech => `<span>${tech}</span>`).join('');

    // Files
    const filesList = document.getElementById('projectModalFiles');
    if (project.files && project.files.length > 0) {
        filesList.innerHTML = project.files.map(file => `
            <div class="file-item">
                <span class="file-item-icon">${file.icon || getFileIcon(file.type)}</span>
                <span>${file.name} ${file.size ? `(${formatFileSize(file.size)})` : ''}</span>
            </div>
        `).join('');
    } else {
        filesList.innerHTML = '<div style="color: #999;">No files</div>';
    }

    modal.classList.add('show');
}

// ===== CLOSE PROJECT MODAL =====
function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    modal.classList.remove('show');
}

// Close modal on outside click
document.addEventListener('click', function(e) {
    const projectModal = document.getElementById('projectModal');
    const uploadModal = document.getElementById('uploadModal');
    
    if (e.target === projectModal) {
        closeProjectModal();
    }
    if (e.target === uploadModal) {
        closeUploadModal();
    }
});

// ===== SMOOTH SCROLL FUNCTIONS =====
function scrollToContact() {
    const contactSection = document.getElementById('contact');
    contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
        document.getElementById('name').focus();
    }, 600);
}

function scrollToProjects() {
    const projectsSection = document.getElementById('projects');
    projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== NAVIGATION =====
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 100;

    document.querySelectorAll('section, header').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== FORM SUBMISSION =====
const contactForm = document.getElementById('contactForm');

function validateName(name) {
    return name.trim().length >= 2;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateMessage(message) {
    return message.trim().length >= 5;
}

function showError(input, errorElement, message) {
    input.classList.add('error');
    errorElement.textContent = message;
}

function clearError(input, errorElement) {
    input.classList.remove('error');
    errorElement.textContent = '';
}

function showFormMessage(type, message) {
    const formMessages = document.getElementById('formMessages');
    formMessages.className = `form-messages ${type}`;
    formMessages.textContent = message;
    
    setTimeout(() => {
        formMessages.innerHTML = '';
        formMessages.classList.remove('success', 'error');
    }, 4000);
}

const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const submitBtn = document.getElementById('submitBtn');

nameInput.addEventListener('blur', function() {
    const errorElement = document.getElementById('nameError');
    if (!validateName(this.value)) {
        showError(this, errorElement, 'Name required (min 2 characters)');
    } else {
        clearError(this, errorElement);
    }
});

emailInput.addEventListener('blur', function() {
    const errorElement = document.getElementById('emailError');
    if (!validateEmail(this.value)) {
        showError(this, errorElement, 'Valid email required');
    } else {
        clearError(this, errorElement);
    }
});

messageInput.addEventListener('blur', function() {
    const errorElement = document.getElementById('messageError');
    if (!validateMessage(this.value)) {
        showError(this, errorElement, 'Message required (min 5 characters)');
    } else {
        clearError(this, errorElement);
    }
});

contactForm.addEventListener('submit', function(event) {
    event.preventDefault();

    let isValid = true;
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');

    if (!validateName(nameInput.value)) {
        showError(nameInput, nameError, 'Name required (min 2 characters)');
        isValid = false;
    } else {
        clearError(nameInput, nameError);
    }

    if (!validateEmail(emailInput.value)) {
        showError(emailInput, emailError, 'Valid email required');
        isValid = false;
    } else {
        clearError(emailInput, emailError);
    }

    if (!validateMessage(messageInput.value)) {
        showError(messageInput, messageError, 'Message required (min 5 characters)');
        isValid = false;
    } else {
        clearError(messageInput, messageError);
    }

    if (!isValid) return;

    submitBtn.disabled = true;
    document.querySelector('#submitBtn .btn-text').textContent = 'Sending...';
    document.getElementById('spinner').style.display = 'block';

    setTimeout(() => {
        const formData = {
            jina: nameInput.value.trim(),
            email: emailInput.value.trim(),
            ujumbe: messageInput.value.trim(),
            timestamp: new Date().toLocaleString('sw-TZ')
        };

        let messages = JSON.parse(localStorage.getItem('portfolioMessages')) || [];
        messages.push(formData);
        localStorage.setItem('portfolioMessages', JSON.stringify(messages));

        showFormMessage('success', `✅ Thank you ${nameInput.value}! Your message has been saved.`);
        
        contactForm.reset();
        clearError(nameInput, document.getElementById('nameError'));
        clearError(emailInput, document.getElementById('emailError'));
        clearError(messageInput, document.getElementById('messageError'));

        submitBtn.disabled = false;
        document.querySelector('#submitBtn .btn-text').textContent = 'Send Message';
        document.getElementById('spinner').style.display = 'none';
    }, 1500);
});

// ===== SCROLL REVEAL =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.scroll-reveal').forEach(section => {
    observer.observe(section);
});

// ===== CONSOLE MESSAGE =====
console.log('%c✨ JULIUS BONGOLE - PORTFOLIO v4', 'font-size: 18px; font-weight: bold; color: #3498db;');
console.log('%c📁 File Upload System Active!', 'color: #27ae60; font-weight: bold;');
console.log('%c🔐 Admin Mode: Protected Upload System', 'color: #e74c3c; font-weight: bold;');
console.log('%cSupported file formats: Images, Documents, Code, Videos, Database, Network configs', 'color: #666;');
console.log('%cDefault Admin Password: Daniel2024 (Change in script_v4.js line 3)', 'color: #f39c12; font-weight: bold;');
