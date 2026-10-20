const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute("aria-label", isExpanded ? "Abrir menu" : "Fechar menu");
    siteNav.classList.toggle("is-open", !isExpanded);
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menu");
      siteNav.classList.remove("is-open");
    }
  });
}

const year = document.querySelector("#current-year");
if (year) {
  year.textContent = String(new Date().getFullYear());
}

const projectCarousel = document.querySelector(".project-carousel");

if (projectCarousel) {
  const projectButtons = Array.from(projectCarousel.querySelectorAll(".project-logo"));
  const projectTrack = projectCarousel.querySelector(".project-logo-track");
  const detailCategory = projectCarousel.querySelector("#project-detail-category");
  const detailTitle = projectCarousel.querySelector("#project-detail-title");
  const detailDescription = projectCarousel.querySelector("#project-detail-description");
  const detailAction = projectCarousel.querySelector("#project-detail-action");
  const projectDetails = {
    chave: {
      title: "Chave Academe",
      category: "Pesquisa · comunicação científica",
      description: "Iniciativa editorial e de comunicação dedicada a expandir o alcance da produção científica, transformando teses, dissertações e artigos em formatos dinâmicos, acessíveis e de alto impacto, como livros, podcasts, audiopapers e infográficos. Une rigor acadêmico, excelência estética e inteligência estratégica para conectar o conhecimento produzido na universidade ao grande público e ao mercado, valorizando pesquisadores e ampliando a visibilidade de sua ciência.",
      status: "Em desenvolvimento",
    },
    agro: {
      title: "Agro Ideias",
      category: "Sustentabilidade · consultoria",
      description: "Projeto de mapeamento, gestão de contratos e planejamento de resíduos sólidos em condomínios residenciais, incluindo estudos de viabilidade para microbiodigestores.",
      status: "Finalizado",
    },
    suba: {
      title: "SUBA",
      category: "Mobilidade urbana · bikesharing",
      description: "O SUBA (Soluções Urbanas de Bicicletas para Aluguel) foi um projeto piloto incubado de mobilidade e bikesharing. Seu objetivo foi validar a viabilidade operacional e a estrutura de um sistema urbano de bicicletas compartilhadas por meio do teste de hipóteses e do cadastro real de 85 usuários, demonstrando capacidade de prototipagem rápida, teste de MVP e modelagem de negócios aplicados.",
      status: "Finalizado",
    },
    mareconomico: {
      title: "Mareconomico",
      category: "Pesquisa · publicação",
      description: "Repositório de estudos, pesquisas e ilustrações dedicado a compartilhar a compreensão de conceitos e debates econômicos.",
      url: "https://sites.google.com/view/mareconomicobysrmaoli/sobre",
      linkLabel: "Conhecer o projeto",
    },
  };

  const selectProject = (index) => {
    const selectedButton = projectButtons[index];
    const project = projectDetails[selectedButton.dataset.project];

    projectButtons.forEach((button, buttonIndex) => {
      const isSelected = buttonIndex === index;
      button.classList.toggle("is-selected", isSelected);
      button.setAttribute("aria-pressed", String(isSelected));
    });

    detailCategory.textContent = project.category;
    detailTitle.textContent = project.title;
    detailDescription.textContent = project.description;
    detailAction.replaceChildren();

    if (project.url) {
      const link = document.createElement("a");
      link.className = "project-link";
      link.href = project.url;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.append(document.createTextNode(project.linkLabel));

      const arrow = document.createElement("span");
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "↗";
      link.append(arrow);
      detailAction.append(link);
    } else {
      const status = document.createElement("span");
      status.className = project.status === "Em desenvolvimento"
        ? "project-status project-status--active"
        : "project-status";
      status.textContent = project.status;
      detailAction.append(status);
    }

    const trackBounds = projectTrack.getBoundingClientRect();
    const buttonBounds = selectedButton.getBoundingClientRect();
    if (buttonBounds.left < trackBounds.left || buttonBounds.right > trackBounds.right) {
      projectTrack.scrollBy({
        left: buttonBounds.left - trackBounds.left - (trackBounds.width - buttonBounds.width) / 2,
        behavior: "smooth",
      });
    }
  };

  projectButtons.forEach((button, index) => {
    button.addEventListener("click", () => selectProject(index));
  });

  projectCarousel.querySelectorAll("[data-carousel-direction]").forEach((control) => {
    control.addEventListener("click", () => {
      const currentIndex = projectButtons.findIndex((button) => button.getAttribute("aria-pressed") === "true");
      const direction = Number(control.dataset.carouselDirection);
      const nextIndex = (currentIndex + direction + projectButtons.length) % projectButtons.length;
      selectProject(nextIndex);
    });
  });

  projectTrack.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
      return;
    }

    const currentIndex = projectButtons.indexOf(document.activeElement);
    if (currentIndex === -1) {
      return;
    }

    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (currentIndex + direction + projectButtons.length) % projectButtons.length;
    projectButtons[nextIndex].focus();
    selectProject(nextIndex);
  });
}
