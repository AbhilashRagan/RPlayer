<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST");
    header("Access-Control-Allow-Headers: *");

    $data1 = file_get_contents("php://input");
    $data2 = json_decode($data1, true);
    $token = $data2['token'];

    require 'vendor/autoload.php';

    $conn = new mysqli("127.0.0.1", "root", "", "rplayer");

    use Firebase\JWT\JWT;
    use Firebase\JWT\Key;

    $key = "kjhsdkjsbakfjbdkfbsdjhbfjsd";
    try
    {
        $values = JWT::decode($token, new Key($key, 'HS256'));
        $data = (array)$values;
        $values2 = (array)$data['data'];
        $email = $values2['email'];
        $password = $values2['password'];

        $query = "SELECT * FROM credentials WHERE email = '$email'";
        $result = mysqli_query($conn, $query);
        if(mysqli_num_rows($result) > 0)
        {
            $row = mysqli_fetch_row($result);
            if(password_verify($password, $row[1]))
            {
                echo json_encode("Authorized");
            }
            else
            {
                echo json_encode("Unauthorized");
            }
            exit();
        }
        else
        {
            echo json_encode("Unauthorized");
        }
    }
    catch(Exception $e)
    {
        echo json_encode("Unauthorized");
    }
?>