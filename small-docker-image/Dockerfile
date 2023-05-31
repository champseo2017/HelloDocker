# Use Nginx image from Docker Hub
FROM nginx:alpine

# Remove the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Replace it with our own configuration file
COPY etc/nginx/conf.d/nginx.conf /etc/nginx/conf.d/

# Copy the HTML file to the Nginx document root
COPY index.html /usr/share/nginx/html/

# Expose ports
EXPOSE 8080
