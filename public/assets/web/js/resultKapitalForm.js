"use strict";

var AppResultKapitalWeb = (function () {
  function init() {
    var elementId = "AppResultKapitalWeb";
    var element = document.getElementById(elementId);

    if (element) {
      var uid = element.getAttribute("uid");
      element.removeAttribute("uid");

      var createApp = function (config) {
        var scope = config.scope;
        var uid = config.uid;
        var instance = {};

        return new Vue({
          el: "#" + scope,
          data: function () {
            return {
              // Results data
              developed: { cppc: 0, kd: 0, ke: 0, koa: 0 },
              emergent: { cppc: 0, kd: 0, ke: 0, koa: 0 },
              company: { cppc: 0, kd: 0, ke: 0, koa: 0 },
              template: {},
              typeId: 1,
              title: "Resultados generales",
              loading: true,
              currency: "usd",
              cppc: 0,
              kd: 0,
              ke: 0,
              koa: 0,

              // Form data
              formData: {
                type_id: 1,
                country_id: null,
                sector_id: null,
                currency: "Soles",
                dc_ratio: null,
                kd: null,
                dc_ratio_optimized: null,
                effective_tax_rate_optimized: null,
                beta_levered_optimized: null,
              },
              countries: [],
              sectors: [],
              showFinancialData: false,
            };
          },
          created: function () {
            instance = this;
          },
          mounted: function () {
            instance.initialize();
          },
          methods: {
            initialize: function () {
              instance.loadFormData();
              instance.onDetail();
            },

            loadFormData: function () {
              // Load form data from backend
              helper
                .post("/kapital/" + uid + "/financial-data")
                .then(function (response) {
                  if (response.success && response.data.form) {
                    var formData = response.data.form;
                    console.log("Loading form data:", formData);

                    // Populate form fields
                    instance.formData.type_id = formData.type_id || 1;
                    instance.formData.country_id = formData.country_id;
                    instance.formData.sector_id = formData.sector_id;
                    instance.formData.currency = formData.currency || "Soles";
                    instance.formData.dc_ratio = formData.dc_ratio;
                    instance.formData.kd = formData.kd;

                    // Load financial data if available
                    if (
                      formData.dc_ratio_optimized ||
                      formData.effective_tax_rate_optimized ||
                      formData.beta_levered_optimized
                    ) {
                      instance.formData.dc_ratio_optimized =
                        formData.dc_ratio_optimized;
                      instance.formData.effective_tax_rate_optimized =
                        formData.effective_tax_rate_optimized;
                      instance.formData.beta_levered_optimized =
                        formData.beta_levered_optimized;
                      instance.showFinancialData = true;
                    }

                    // Load dropdown data if available
                    if (response.data.countries) {
                      instance.countries = response.data.countries;
                    }
                    if (response.data.sectors) {
                      instance.sectors = response.data.sectors;
                    }
                  }
                })
                .catch(function (error) {
                  console.log("Error loading form data:", error);
                });
            },

            onDetail: function () {
              instance.loading = true;
              helper
                .post("/kapital/" + uid + "/result/detail")
                .then(function (response) {
                  var success = response.success;
                  var data = response.data;
                  var message = response.message;

                  if (!success) {
                    throw message;
                  }

                  instance.template = data.template;
                  instance.emergent = data.param.emergent;
                  instance.developed = data.param.developed;
                  instance.company = data.param.company;
                  instance.typeId = instance.template.type_id;
                  instance.currency =
                    data.param.currency === "Soles" ? "pen" : "usd";

                  setTimeout(function () {
                    if (instance.typeId == 1) {
                      instance.onSectorDetail();
                    } else {
                      instance.onCompanyDetail();
                    }
                    instance.loading = false;
                  }, 200);
                })
                .catch(function (error) {
                  sweet2.error({ html: error });
                });
            },

            onSectorDetail: function () {
              instance.title = "Resultados generales";
              bsGraph.square("bsGroup1", {
                q1: {
                  title: "Activo",
                  text:
                    "Koa = " + instance.formatterx100p(instance.emergent.koa),
                  value: instance.emergent.koa,
                },
                q2: {
                  title: "Pasivo",
                  text:
                    "Kd(1-T) = " +
                    instance.formatterx100p(instance.emergent.kd),
                  value: instance.emergent.kd,
                },
                q3: {
                  title: "Patrimonio",
                  text: "Ke = " + instance.formatterx100p(instance.emergent.ke),
                  value: instance.emergent.ke,
                },
              });

              bsGraph.square("bsGroup2", {
                q1: {
                  title: "Activo",
                  text:
                    "Koa = " + instance.formatterx100p(instance.developed.koa),
                  value: instance.developed.koa,
                },
                q2: {
                  title: "Pasivo",
                  text:
                    "Kd(1-T) = " +
                    instance.formatterx100p(instance.developed.kd),
                  value: instance.developed.kd,
                },
                q3: {
                  title: "Patrimonio",
                  text:
                    "Ke = " + instance.formatterx100p(instance.developed.ke),
                  value: instance.developed.ke,
                },
              });
            },

            onCompanyDetail: function () {
              instance.title = "Resultados generales de la empresa";
              instance.onCurrencyCompany();

              bsGraph.square("bsGroupCard2", {
                q1: {
                  title: "Activo",
                  text:
                    "Koa = " + instance.formatterx100p(instance.developed.koa),
                  value: instance.developed.koa,
                },
                q2: {
                  title: "Pasivo",
                  text:
                    "Kd(1-T) = " +
                    instance.formatterx100p(instance.developed.kd),
                  value: instance.developed.kd,
                },
                q3: {
                  title: "Patrimonio",
                  text:
                    "Ke = " + instance.formatterx100p(instance.developed.ke),
                  value: instance.developed.ke,
                },
              });

              bsGraph.square("bsGroupCard3", {
                q1: {
                  title: "Activo",
                  text:
                    "Koa = " + instance.formatterx100p(instance.emergent.koa),
                  value: instance.emergent.koa,
                },
                q2: {
                  title: "Pasivo",
                  text:
                    "Kd(1-T) = " +
                    instance.formatterx100p(instance.emergent.kd),
                  value: instance.emergent.kd,
                },
                q3: {
                  title: "Patrimonio",
                  text: "Ke = " + instance.formatterx100p(instance.emergent.ke),
                  value: instance.emergent.ke,
                },
              });
            },

            formatterx100p: function (value) {
              return value + "%";
            },

            onCurrency: function () {
              instance.onCurrencyCompany();
            },

            onCurrencyCompany: function () {
              var data = {
                koa: instance.company.pen.koa,
                kd: instance.company.pen.kd,
                ke: instance.company.pen.ke,
              };

              instance.cppc = instance.company.pen.cppc;
              instance.kd = instance.company.pen.kd;
              instance.ke = instance.company.pen.ke;
              instance.koa = instance.company.pen.koa;

              if (instance.currency === "usd") {
                data = {
                  koa: instance.company.usd.koa,
                  kd: instance.company.usd.kd,
                  ke: instance.company.usd.ke,
                };

                instance.cppc = instance.company.usd.cppc;
                instance.kd = instance.company.usd.kd;
                instance.ke = instance.company.usd.ke;
                instance.koa = instance.company.usd.koa;
              }

              bsGraph.square("bsGroupCard1", {
                q1: {
                  title: "Activo",
                  text: "Koa = " + instance.formatterx100p(data.koa),
                  value: data.koa,
                },
                q2: {
                  title: "Pasivo",
                  text: "Kd(1-T) = " + instance.formatterx100p(data.kd),
                  value: data.kd,
                },
                q3: {
                  title: "Patrimonio",
                  text: "Ke = " + instance.formatterx100p(data.ke),
                  value: data.ke,
                },
              });
            },

            toggleFinancialData: function () {
              instance.showFinancialData = !instance.showFinancialData;
            },

            updateCalculation: function () {
              instance.loading = true;

              var formElement = document.getElementById("resultForm");
              var formData = new FormData(formElement);

              // Add financial data if present
              if (instance.formData.dc_ratio_optimized) {
                formData.append(
                  "dc_ratio_optimized",
                  instance.formData.dc_ratio_optimized
                );
              }
              if (instance.formData.effective_tax_rate_optimized) {
                formData.append(
                  "effective_tax_rate_optimized",
                  instance.formData.effective_tax_rate_optimized
                );
              }
              if (instance.formData.beta_levered_optimized) {
                formData.append(
                  "beta_levered_optimized",
                  instance.formData.beta_levered_optimized
                );
              }

              helper
                .postForm("/kapital/" + uid + "/update", formData)
                .then(function (response) {
                  if (response.success) {
                    sweet2
                      .success({
                        title: "Actualizado",
                        text: "Los cálculos han sido actualizados exitosamente",
                      })
                      .then(function () {
                        // Reload the results
                        instance.onDetail();
                      });
                  } else {
                    throw response.message || "Error al actualizar";
                  }
                })
                .catch(function (error) {
                  instance.loading = false;
                  sweet2.error({
                    title: "Error",
                    text: error,
                  });
                });
            },
          },
        });
      };

      var app = createApp({ scope: elementId, uid: uid });
      window.AppFinanceWeb.modules.push(app);
    }
  }

  return {
    init: init,
  };
})();

document.addEventListener("DOMContentLoaded", function () {
  AppResultKapitalWeb.init();
});
