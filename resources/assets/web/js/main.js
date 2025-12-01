const initKapital = () => {
  const forms = document.querySelectorAll(".formWACC");
  forms.forEach((form) => {
    const uid = form.getAttribute("id");
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Validar campos financieros si están activados
      const useFinancialData = form.querySelector(
        'input[name="useFinancialData"]'
      );
      if (useFinancialData && useFinancialData.checked) {
        const financialValidation = validateFinancialData(form);
        if (!financialValidation.valid) {
          sweet2.show({
            type: "error",
            html: "Error en datos financieros: " + financialValidation.message,
          });
          return;
        }
      }

      sweet2.loading();
      const formData = new FormData(e.target);

      // Debug: Mostrar datos que se envían
      console.log("=== DATOS ENVIADOS AL BACKEND ===");
      for (let [key, value] of formData.entries()) {
        console.log(key + ": " + value);
      }

      const url = uid ? "/kapital/" + uid + "/update" : "/kapital/store";
      helper
        .post(url, formData)
        .then(({ success, data, message }) => {
          if (!success) {
            throw message;
          }
          setTimeout(() => {
            if (uid) {
              window.AppFinanceWeb.modules.forEach((module) => {
                module.$mount();
              });
              sweet2.success({ text: message });
            } else {
              // Guardar datos del formulario antes de redirigir
              const formObject = {};
              for (let [key, value] of formData.entries()) {
                formObject[key] = value;
              }
              localStorage.setItem(
                "kapital_form_data_" + data.uid,
                JSON.stringify(formObject)
              );

              window.location.href = "/kapital/" + data.uid + "/resultados";
            }
          }, 100);
        })
        .catch((error) => {
          console.log(error);
          sweet2.show({ type: "error", html: error });
        });
    });
  });

  // Función para validar datos financieros
  const validateFinancialData = (form) => {
    const dcRatio = form.querySelector('input[name="dc_ratio"]')?.value;
    const effectiveTaxRate = form.querySelector(
      'input[name="effective_tax_rate"]'
    )?.value;
    const betaLevered = form.querySelector('input[name="beta_levered"]')?.value;

    // Validar D/C Ratio
    if (dcRatio && (parseFloat(dcRatio) < 0 || parseFloat(dcRatio) > 10)) {
      return { valid: false, message: "D/C Ratio debe estar entre 0 y 10" };
    }

    // Validar Tasa Efectiva de Impuesto
    if (
      effectiveTaxRate &&
      (parseFloat(effectiveTaxRate) < 0 || parseFloat(effectiveTaxRate) > 100)
    ) {
      return {
        valid: false,
        message: "Tasa Efectiva de Impuesto debe estar entre 0% y 100%",
      };
    }

    // Validar Beta Apalancado
    if (
      betaLevered &&
      (parseFloat(betaLevered) < 0 || parseFloat(betaLevered) > 5)
    ) {
      return {
        valid: false,
        message: "Beta Apalancado debe estar entre 0 y 5",
      };
    }

    return { valid: true };
  };

  // Restaurar datos del formulario al cargar la página
  const restoreFormData = () => {
    const urlPath = window.location.pathname;
    const uidMatch = urlPath.match(/\/kapital\/([^\/]+)/);
    if (uidMatch) {
      const uid = uidMatch[1];
      const savedData = localStorage.getItem("kapital_form_data_" + uid);

      console.log("=== RESTAURANDO DATOS DEL FORMULARIO ===");
      console.log("UID:", uid);
      console.log("Datos guardados:", savedData);

      if (savedData) {
        const formData = JSON.parse(savedData);
        const form = document.querySelector(".formWACC");

        console.log("Formulario encontrado:", form);
        console.log("Datos a restaurar:", formData);

        if (form) {
          Object.keys(formData).forEach((key) => {
            const input = form.querySelector(`[name="${key}"]`);
            console.log(`Campo ${key}:`, input, "Valor:", formData[key]);

            if (input) {
              input.value = formData[key];
              // Para select2, trigger change event
              if (input.hasAttribute("data-control") && input.value) {
                $(input).val(formData[key]).trigger("change");
              }

              // Para checkboxes (como useFinancialData)
              if (input.type === "checkbox" && formData[key] === "1") {
                input.checked = true;
                console.log(`Checkbox ${key} activado`);

                // Activar la sección financiera si está marcada
                if (key === "useFinancialData") {
                  const collapseSection = document.getElementById(
                    "collapseFinancialData"
                  );
                  const toggleIcon = document.getElementById(
                    "collapseFaToggleFinancial"
                  );
                  const toggleLabel = document.querySelector(
                    'label[for="financialDataToggle"]'
                  );

                  console.log("Activando sección financiera...");
                  console.log("Collapse section:", collapseSection);
                  console.log("Toggle icon:", toggleIcon);
                  console.log("Toggle label:", toggleLabel);

                  if (collapseSection && toggleIcon) {
                    collapseSection.classList.add("show");
                    toggleIcon.classList.remove("fa-toggle-off");
                    toggleIcon.classList.add("fa-toggle-on");

                    if (toggleLabel) {
                      toggleLabel.classList.remove("collapsed");
                      toggleLabel.setAttribute("aria-expanded", "true");
                    }
                  }
                }
              }
            }
          });
        }
        // Limpiar datos guardados después de restaurar
        localStorage.removeItem("kapital_form_data_" + uid);
        console.log("Datos restaurados y limpiados del localStorage");
      }

      // También verificar si hay datos del backend directamente en la página
      if (window.AppFinanceWeb && window.AppFinanceWeb.formData) {
        console.log(
          "Datos del backend encontrados:",
          window.AppFinanceWeb.formData
        );
        // Aplicar datos del backend si existen
        applyBackendFormData(window.AppFinanceWeb.formData);
      }
    }
  };

  // Función para aplicar datos del backend
  const applyBackendFormData = (backendData) => {
    const form = document.querySelector(".formWACC");
    if (!form || !backendData) return;

    console.log("=== APLICANDO DATOS DEL BACKEND ===");
    console.log("Datos del backend:", backendData);

    // 1) Mapeo directo de campos con el mismo nombre entre backend y formulario
    const directMapping = {
      date: backendData.date,
      sector: backendData.sector,
      instrument: backendData.instrument,
      bono: backendData.bono,
      country: backendData.country,
      currency: backendData.currency,
      devaluation: backendData.devaluation,
      tax: backendData.tax,
      dc_ratio: backendData.dc_ratio,
      effective_tax_rate: backendData.effective_tax_rate,
      beta_levered: backendData.beta_levered,
      beta_unlevered: backendData.beta_unlevered,
      useFinancialData: backendData.useFinancialData,
    };

    Object.keys(directMapping).forEach((field) => {
      const value = directMapping[field];
      if (value !== undefined && value !== null && value !== "") {
        const input = form.querySelector(`[name="${field}"]`);
        if (input) {
          // Para checkbox
          if (input.type === "checkbox") {
            input.checked = value === "1" || value === 1 || value === true;
          } else {
            input.value = value;
          }
          // Soporte select2 y listeners
          if (input.hasAttribute("data-control")) {
            try {
              $(input).val(value).trigger("change");
            } catch (e) {}
          } else {
            input.dispatchEvent(new Event("change"));
          }
          console.log(`Campo ${field} establecido a:`, value);
        }
      }
    });

    // 2) Mapeo especial (nombres distintos entre backend y formulario)
    const specialMapping = {
      debt: backendData.epd, // Porcentaje de deuda
      capital: backendData.epc, // Porcentaje de capital
      kd: backendData.ekd, // Costo de deuda
    };

    Object.keys(specialMapping).forEach((field) => {
      const value = specialMapping[field];
      if (value !== undefined && value !== null && value !== "") {
        const input = form.querySelector(`[name="${field}"]`);
        if (input) {
          input.value = value;
          if (input.hasAttribute("data-control")) {
            try {
              $(input).val(value).trigger("change");
            } catch (e) {}
          } else {
            input.dispatchEvent(new Event("change"));
          }
          console.log(`Campo ${field} (especial) establecido a:`, value);
        }
      }
    });

    // 3) Activar sección financiera si corresponde
    let hasFinancialData = false;
    [
      "dc_ratio",
      "effective_tax_rate",
      "beta_levered",
      "beta_unlevered",
    ].forEach((f) => {
      if (
        backendData[f] !== undefined &&
        backendData[f] !== null &&
        backendData[f] !== ""
      ) {
        hasFinancialData = true;
      }
    });

    // Si hay datos financieros, activar la sección
    if (hasFinancialData || backendData.useFinancialData === "1") {
      const useFinancialDataInput = form.querySelector(
        'input[name="useFinancialData"]'
      );
      const collapseSection = document.getElementById("collapseFinancialData");
      const toggleIcon = document.getElementById("collapseFaToggleFinancial");
      const toggleLabel = document.querySelector(
        'label[for="financialDataToggle"]'
      );

      console.log("Activando sección financiera desde backend...");

      if (useFinancialDataInput) {
        useFinancialDataInput.checked = true;
      }

      if (collapseSection && toggleIcon) {
        collapseSection.classList.add("show");
        toggleIcon.classList.remove("fa-toggle-off");
        toggleIcon.classList.add("fa-toggle-on");

        if (toggleLabel) {
          toggleLabel.classList.remove("collapsed");
          toggleLabel.setAttribute("aria-expanded", "true");
        }
      }
    }
  };

  // Exponer función para que otros scripts (p.ej., result.twig) puedan invocarla
  try {
    window.AppFinanceWeb = window.AppFinanceWeb || {};
    window.AppFinanceWeb.applyBackendFormData = applyBackendFormData;
  } catch (e) {}

  // Ejecutar restauración después de que la página se cargue completamente
  setTimeout(restoreFormData, 500);

  const pdFormInput = document.getElementById("pdFormInput");
  if (pdFormInput) {
    pdFormInput.addEventListener("keyup", (e) => {
      const value = e.target.value;
      let pc = 0;
      if (Number(value) <= 100) {
        pc = 100 - value;
      }
      const pcFormInput = document.getElementById("pcFormInput");
      if (pcFormInput) {
        pcFormInput.value = pc;
      }
    });
  }

  $("#countryFormInput").on("select2:select", function (e) {
    const data = e.params.data;
    const country = data.text;
    const dateFormInput = document.getElementById("dateFormInput");
    const taxFormInput = document.getElementById("taxFormInput");
    const devaluationFormInput = document.getElementById(
      "devaluationFormInput"
    );

    if (devaluationFormInput) {
      devaluationFormInput.value = country == "Peru" ? "1.64" : "";
    }

    if (dateFormInput && dateFormInput.value.length > 0) {
      taxFormInput.value = "Cargando...";
      const year = dateFormInput.value.split("/").pop();
      const formData = new FormData();
      const uid = window.AppFinanceWeb.uid;
      formData.append("country", country);
      formData.append("year", year);
      formData.append("uid", uid);
      helper
        .post("/kapital/taxrate", formData)
        .then(({ success, data, message }) => {
          if (!success) {
            throw message;
          }
          if (taxFormInput) {
            taxFormInput.value = data.param.taxrate;
          }
        })
        .catch((error) => {
          if (taxFormInput) {
            taxFormInput.value = "";
          }
          console.log(error);
          sweet2.show({ type: "error", html: error });
        });
    }
  });
};

function collapseFaToggle(scope, toggle) {
  const collapseFaToggle = document.getElementById(toggle),
    companyInputs = document.getElementsByName("companyInput");
  if (scope.classList.contains("collapsed")) {
    if (collapseFaToggle) {
      collapseFaToggle.classList.add("fa-toggle-off");
      collapseFaToggle.classList.remove("fa-toggle-on");
    }
    if (companyInputs) {
      companyInputs.forEach((input) => {
        input.removeAttribute("required");
      });
    }
  } else {
    if (collapseFaToggle) {
      collapseFaToggle.classList.add("fa-toggle-on");
      collapseFaToggle.classList.remove("fa-toggle-off");
      if (companyInputs) {
        companyInputs.forEach((input) => {
          input.addAttribute("required");
        });
      }
    }
  }
}

const initValora = () => {
  const storeUpdate = (uid, formData) => {
    const url = uid ? "/valora/" + uid + "/update" : "/valora/store";
    helper
      .post(url, formData)
      .then(({ success, data, message }) => {
        if (!success) {
          throw message;
        }
        sweet2.success({ text: message });
        setTimeout(() => {
          sweet2.loading({ text: "Redirigiendo a resultados..." });
          if (uid) {
            /*window.AppFinanceWeb.modules.forEach(module => {
                        module.$mount();
                    });*/
            window.location.href = "/valora/" + uid + "/resultados";
          } else {
            window.location.href = "/valora/" + data.uid + "/resultados";
          }
        }, 2000);
      })
      .catch((error) => {
        sweet2.show({ type: "error", html: error });
      });
  };
  const forms = document.querySelectorAll(".formInputValora");
  forms.forEach((form) => {
    const uid = form.getAttribute("id");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (uid) {
        sweet2.loading();
      } else {
        sweet2.loading({
          text: "Estamos procensando su información, nos tomará algunos minutos en realizarlo. Cargando...",
        });
      }
      const formData = new FormData(e.target);
      storeUpdate(uid, formData);
    });
  });

  const forms2 = document.querySelectorAll(".formTemplateUserValora");
  forms2.forEach((form) => {
    const uid = form.getAttribute("uid");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (uid) {
        sweet2.loading({
          text: "Estamos procensando su información, nos tomará algunos minutos en realizarlo. Cargando...",
        });
      } else {
        sweet2.loading();
      }
      const formData = new FormData(e.target);
      formData.append("uid", uid);
      helper
        .post(window.AppFinanceWeb.api + "/api/valora/upload", formData)
        .then(({ success, data, message }) => {
          if (!success) {
            throw message;
          }
          /*setTimeout(() => {
                    sweet2.loading({text: 'Estamos procensando su información, nos tomará algunos minutos en realizarlo. Cargando...'});
                    if (uid) {
                        window.AppFinanceWeb.modules.forEach(module => {
                            module.$mount();
                        });
                    } else {                        
                        const formData = new FormData();
                        formData.append('fileUsername', data.filename);
                        storeUpdate(uid, formData, true);                        
                    }
                }, 2000);*/
          let url = window.AppFinanceWeb.api;
          const fileUsername = document.getElementById("fileUsername");
          if (fileUsername) {
            fileUsername.value = data.filename;
          }
          const fileUsernameUrl = document.getElementById("fileUsernameUrl");
          if (fileUsernameUrl) {
            fileUsernameUrl.setAttribute("href", url + data.fileurl);
          }
          const fileUsernameAlert =
            document.getElementById("fileUsernameAlert");
          if (fileUsernameAlert) {
            fileUsernameAlert.classList.remove("d-none");
          }
          e.target.reset();
          bootstrap.Modal.getOrCreateInstance(
            document.getElementById("modalFileUsername")
          ).hide();
          if (uid) {
            setTimeout(() => {
              window.AppFinanceWeb.modules.forEach((module) => {
                module.$mount();
              });
            }, 2000);
          }
          sweet2.success({ text: message });
        })
        .catch((error) => {
          sweet2.show({ type: "error", html: error });
        });
    });
  });
};

const initFinance = () => {
  /*const checks = document.querySelectorAll('.bs-check-report');
    const cards =  document.querySelectorAll('.bs-card-report');
    checks.forEach(check => {
        const id = check.getAttribute('id');
        check.addEventListener('change', (e) => {
            const checked = e.target.checked;
            if (cards.length > 0) {
                cards.forEach(card => {
                    const dfor = card.getAttribute('for'); 
                    if (dfor == id) {
                        if (checked) {
                            card.classList.add('active');
                        } else {
                            card.classList.remove('active');
                        }
                    }
                });
            }
        });
    });*/

  const checks = document.querySelectorAll(".check-report");
  const checkforms = document.querySelectorAll(".checkform");
  checks.forEach((check) => {
    check.addEventListener("change", ({ target }) => {
      const { value, checked } = target;
      checkforms.forEach((checkform, index) => {
        checkform.classList.remove("text-primary");
        if (checked) {
          switch (value.trim()) {
            case "reporte-datos":
              if ([0, 1].includes(index)) {
                checkform.classList.add("text-primary");
              }
              break;
            case "reporte-detallado":
              if ([0, 1, 2].includes(index)) {
                checkform.classList.add("text-primary");
              }
              break;
            case "consultoria-especializada":
              if ([0, 1, 2, 3].includes(index)) {
                checkform.classList.add("text-primary");
              }
              break;
          }
        }
      });
    });
  });
  /*const formReportKapital = document.getElementById('formReportKapital');
    if (formReportKapital) {
        const uid = window.AppFinanceWeb.uid;
        console.log(formReportKapital);
        formReportKapital.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const slug = formData.get('report');
            sweet2.loading();
            console.log(`/kapital/${uid}/reportes/${slug}`);
            // window.location.href = `/kapital/${uid}/reportes/${slug}`;
            helper.post(`/kapital/${uid}/reportes/generar`, formData)
            .then(({success, data, message}) => {
                if (!success) {
                    throw message;
                }
            
                window.location.href = `/kapital/${uid}/repostes/${slug}`;
                console.log(data);
                sweet2.success({text: message});
            })
            .catch(error => {
                sweet2.show({type: 'error', html: error});
            });
        });
    }*/

  const viewport = (url, name) => {
    const extension = url.split(".").pop().toLowerCase();
    const $docs = [
        "doc",
        "docx",
        "xlsx",
        "xls",
        "pptx",
        "ppt",
        "pdf",
        "mpp",
        "ppsx",
        "xlsm",
        "pptm",
      ],
      $images = ["jpg", "jpeg", "png", "gif"],
      $videos = ["mp4"],
      $embebidos = ["embebido"];
    let $html = "";
    const title = `<div class="col"><h3>${name}</h3></div>`;
    const btnDescarga = `<div class="alert alert-warning" role="alert">
                                Si aún no puede visualizar el contenido, <b><a href="${url}" target="_blank" > click aquí para Descargar Archivo </a></b> y espere unos segundos.
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>`;

    if ($docs.includes(extension)) {
      $html = `${title}${btnDescarga}
                <div class='col' style='height:100%'>
                    <div id="warning-iframe-no-loaded" class="alert alert-warning" role="alert">
                        Si aún no puede visualizar el contenido , por favor haga <b><a href='' onclick="return window.realoadIframe(this, '#iframeA001','https://docs.google.com/viewer?url=${url}&embedded=true')" >clic aquí</a></b> y espere unos segundos.
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <iframe name='destinoA' onload='window.removeReloadAlertIframeNoLoaded()' width='100%'  height='100%' id='iframeA001' src='https://docs.google.com/viewer?url=${url}&embedded=true' scrolling='hidden'  frameborder='0px' cellSpacing='0' cellPadding='0'  target='_self'>
                        Tu Navegador no esta configurado para soportar estos frames
                    </iframe>
                </div>`;
    } else if ($videos.includes(extension)) {
      $html = `<div class="col">
                        ${title}
                        <video width="100%" height="100%" controls>
                            <source src="${url}" type="video/${extension}">
                            Your browser does not support the video tag.
                        </video>
                    </div>`;
    } else if ($images.includes(extension)) {
      $html = `<div class="col">${title}<img src="${url}" alt="Imagen" width="100%" height="100%"></div>`;
    } else {
      $html = `<div class='col' style='height:100%'>${url}</div>`;
    }
    return $html;
  };

  const btnviewfiles = document.querySelectorAll(".btnviewfile");
  const containerviewer = document.querySelector("#containerviewer");
  btnviewfiles.forEach((btn, idx) => {
    const url = btn.getAttribute("d-url");
    const name = btn.getAttribute("d-name");
    btn.addEventListener("click", (e) => {
      if (containerviewer) {
        containerviewer.innerHTML = viewport(url, name);
      }
    });
    if (idx == 0) {
      if (containerviewer) {
        containerviewer.innerHTML = viewport(url, name);
      }
    }
  });

  window.removeReloadAlertIframeNoLoaded = function () {
    $("#warning-iframe-no-loaded").remove();
  };
  window.realoadIframe = function (tag, id, url) {
    $(id).attr("src", url);
    return false;
  };

  const initReportKapital = () => {
    const index = function ({ scope, uid }) {
      let self = {};
      return new Vue({
        el: "#" + scope,
        data() {
          return {
            designs: [],
            design_contents: [],
            loading: true,
            all_checked: false,
          };
        },
        created: function () {
          self = this;
        },
        mounted: function () {
          self.initialize();
        },
        watch: {},
        computed: {},
        methods: {
          initialize: function () {},
          onList: () => {
            self.loading = true;
            helper
              .post("/kapital/" + uid + "/reportes/list")
              .then(function ({ success, data, message }) {
                if (!success) {
                  throw message;
                }
                self.designs = data.designs;
                self.design_contents = data.design_contents;
                self.loading = false;
                setTimeout(() => {
                  self.onContentEvent();
                }, 500);
              })
              .catch(function (err) {
                console.log(err);
                sweet2.error({ html: err });
              });
          },
          onFormReport: (e) => {
            e.preventDefault();
            if (self.all_checked) {
              const modalCotizar = bootstrap.Modal.getOrCreateInstance(
                document.getElementById("kt_modal_cotizar")
              );
              return modalCotizar.show();
            }
            const formData = new FormData(e.target);
            const report = formData.get("report");
            sweet2.loading();
            window.location.href = `/kapital/${uid}/reportes/${report}`;
          },
          onContentEvent: () => {
            const checks = document.querySelectorAll("input[name=report]");
            const checkforms = document.querySelectorAll(".checkform");
            checks.forEach((check) => {
              check.addEventListener("change", ({ target }) => {
                const contentId = target.getAttribute("data-content-id");
                const { value, checked } = target;
                checkforms.forEach((checkform, index) => {
                  checkform.classList.remove("text-primary");
                  if (checked) {
                    switch (Number(contentId)) {
                      case 1:
                        if ([0].includes(index)) {
                          checkform.classList.add("text-primary");
                          self.all_checked = false;
                        }
                        break;
                      case 2:
                        if ([0, 1].includes(index)) {
                          checkform.classList.add("text-primary");
                          self.all_checked = false;
                        }
                        break;
                      case 3:
                        if ([0, 1, 2].includes(index)) {
                          checkform.classList.add("text-primary");
                          self.all_checked = true;
                        }
                        break;
                    }
                  }
                });
              });
            });
          },
          onQuote: () => {
            /*sweet2.loading();
                        helper.post('/kapital/' + uid + '/cotizacion')
                        .then(function ({success, data, message}) {
                            if (!success) {
                                throw message;
                            }
                            sweet2.error({html: err});
                        })
                        .catch(function (err) {
                            console.log(err);
                            sweet2.error({html: err});
                        });*/
          },
        },
      });
    };
    const indexScope = "AppReportKapitalWeb";
    const indexContainer = document.getElementById(indexScope);
    if (indexContainer) {
      const app = index({ scope: indexScope, uid: window.AppFinanceWeb.uid });
      window.AppFinanceWeb.modules.push(app);
    }
  };

  const initReportValora = () => {
    const index = function ({ scope, uid }) {
      let self = {};
      return new Vue({
        el: "#" + scope,
        data() {
          return {
            designs: [],
            design_contents: [],
            loading: true,
            all_checked: false,
          };
        },
        created: function () {
          self = this;
        },
        mounted: function () {
          self.initialize();
        },
        watch: {},
        computed: {},
        methods: {
          initialize: function () {
            self.onList();
          },
          onList: () => {
            self.loading = true;
            helper
              .post("/valora/" + uid + "/reportes/list")
              .then(function ({ success, data, message }) {
                if (!success) {
                  throw message;
                }
                self.designs = data.designs;
                self.design_contents = data.design_contents;
                self.loading = false;
                setTimeout(() => {
                  self.onContentEvent();
                }, 500);
              })
              .catch(function (err) {
                console.log(err);
                sweet2.error({ html: err });
              });
          },
          onFormReport: (e) => {
            e.preventDefault();
            if (self.all_checked) {
              const modalCotizar = bootstrap.Modal.getOrCreateInstance(
                document.getElementById("kt_modal_cotizar")
              );
              return modalCotizar.show();
            }
            const formData = new FormData(e.target);
            const report = formData.get("report");
            sweet2.loading();
            window.location.href = `/valora/${uid}/reportes/${report}`;
          },
          onContentEvent: () => {
            const checks = document.querySelectorAll("input[name=report]");
            const checkforms = document.querySelectorAll(".checkform");
            checks.forEach((check) => {
              check.addEventListener("change", ({ target }) => {
                const contentId = target.getAttribute("data-content-id");
                const { value, checked } = target;
                checkforms.forEach((checkform, index) => {
                  checkform.classList.remove("text-primary");
                  if (checked) {
                    switch (Number(contentId)) {
                      case 1:
                        if ([0].includes(index)) {
                          checkform.classList.add("text-primary");
                          self.all_checked = false;
                        }
                        break;
                      case 2:
                        if ([0, 1].includes(index)) {
                          checkform.classList.add("text-primary");
                          self.all_checked = false;
                        }
                        break;
                      case 3:
                        if ([0, 1, 2].includes(index)) {
                          checkform.classList.add("text-primary");
                          self.all_checked = true;
                        }
                        break;
                    }
                  }
                });
              });
            });
          },
        },
      });
    };
    const indexScope = "AppReportValoraWeb";
    const indexContainer = document.getElementById(indexScope);
    if (indexContainer) {
      const app = index({ scope: indexScope, uid: window.AppFinanceWeb.uid });
      window.AppFinanceWeb.modules.push(app);
    }
  };

  initReportKapital();
  initReportValora();
};

// Inicializar funcionalidad de campos financieros optimizados
const initFinancialOptimizedFields = () => {
  // Manejar toggle de campos financieros optimizados
  const financialToggle = document.getElementById("financialDataToggle");
  const financialSection = document.getElementById("collapseFinancialData");
  const toggleIcon = document.getElementById("collapseFaToggleFinancial");

  if (financialToggle) {
    financialToggle.addEventListener("change", function () {
      if (this.checked) {
        console.log("Campos financieros activados");
        if (financialSection) {
          financialSection.classList.add("show");
        }
        if (toggleIcon) {
          toggleIcon.classList.remove("fa-toggle-off");
          toggleIcon.classList.add("fa-toggle-on");
        }
      } else {
        console.log("Campos financieros desactivados");
        if (financialSection) {
          financialSection.classList.remove("show");
        }
        if (toggleIcon) {
          toggleIcon.classList.remove("fa-toggle-on");
          toggleIcon.classList.add("fa-toggle-off");
        }
        // Limpiar valores cuando se desactiva
        clearFinancialFields();
      }
    });
  }

  // Validación en tiempo real de campos financieros
  const dcRatioInput = document.getElementById("dcRatioFormInput");
  const effectiveTaxRateInput = document.getElementById(
    "effectiveTaxRateFormInput"
  );
  const betaLeveredInput = document.getElementById("betaLeveredFormInput");
  const betaUnleveredInput = document.getElementById("betaUnleveredFormInput");

  // Validar D/C Ratio
  if (dcRatioInput) {
    dcRatioInput.addEventListener("blur", function () {
      const value = parseFloat(this.value);
      if (this.value && (value < 0 || value > 10)) {
        this.classList.add("is-invalid");
        showFieldError(this, "D/C Ratio debe estar entre 0 y 10");
      } else {
        this.classList.remove("is-invalid");
        hideFieldError(this);
      }
    });
  }

  // Validar Tasa Efectiva de Impuesto
  if (effectiveTaxRateInput) {
    effectiveTaxRateInput.addEventListener("blur", function () {
      const value = parseFloat(this.value);
      if (this.value && (value < 0 || value > 100)) {
        this.classList.add("is-invalid");
        showFieldError(this, "Tasa debe estar entre 0% y 100%");
      } else {
        this.classList.remove("is-invalid");
        hideFieldError(this);
      }
    });
  }

  // Validar Beta Apalancado
  if (betaLeveredInput) {
    betaLeveredInput.addEventListener("blur", function () {
      const value = parseFloat(this.value);
      if (this.value && (value < 0 || value > 5)) {
        this.classList.add("is-invalid");
        showFieldError(this, "Beta debe estar entre 0 y 5");
      } else {
        this.classList.remove("is-invalid");
        hideFieldError(this);
      }
    });
  }
};

// Función para limpiar campos financieros
const clearFinancialFields = () => {
  const fields = [
    "dcRatioFormInput",
    "effectiveTaxRateFormInput",
    "betaLeveredFormInput",
    "betaUnleveredFormInput",
  ];
  fields.forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.value = "";
      field.classList.remove("is-invalid");
      hideFieldError(field);
    }
  });
};

// Función para mostrar error en campo
const showFieldError = (field, message) => {
  const existingError = field.parentNode.querySelector(".invalid-feedback");
  if (existingError) {
    existingError.textContent = message;
  } else {
    const errorDiv = document.createElement("div");
    errorDiv.className = "invalid-feedback";
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
  }
};

// Función para ocultar error en campo
const hideFieldError = (field) => {
  const existingError = field.parentNode.querySelector(".invalid-feedback");
  if (existingError) {
    existingError.remove();
  }
};

document.addEventListener("DOMContentLoaded", () => {
  initFinance();
  initKapital();
  initValora();
  initFinancialOptimizedFields();
});
