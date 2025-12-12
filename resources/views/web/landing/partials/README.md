
## Carrusel de Cards de Cursos

platform.twig

| Elemento                      | Descripción                            | Función dentro del componente                   |
| ----------------------------- | -------------------------------------- | ----------------------------------------------- |
| `for item in banners`         | Iteración de la lista de banners       | Genera una tarjeta por cada banner disponible   |
| Tarjeta (`div.card`)          | Contenedor visual de cada banner       | Muestra imagen, título, descripción y botones   |
| `item.imagens[0].patch`       | Ruta de la imagen principal del banner | Se muestra como imagen del card, con enlace     |
| `item.content_name`           | Nombre o título del banner             | Se muestra como texto destacado dentro del card |
| `item.content_caption`        | Descripción corta o detalle            | Se muestra en una lista dentro de la tarjeta    |
| `disabled` → “Próximo”        | Muestra cinta "Próximo" en el banner   | Indica contenido aún no disponible              |
| `item.content_url`            | URL del curso                          | Habilita el botón “Curso de Capacitación”       |
| `item.content_url_biblioteca` | URL hacia la biblioteca                | Habilita el botón “Biblioteca”                  |
| Botones deshabilitados        | Se muestran si no existen URLs         | Mantiene diseño pero impide interacción         |
