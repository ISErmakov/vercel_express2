# То же самое, что и в серверном Dockerfile.

FROM my_pro_image

# Устанавливаем в качестве рабочей директории '/client/'.

WORKDIR /project2/

CMD ["systemctl", "start mongod"]