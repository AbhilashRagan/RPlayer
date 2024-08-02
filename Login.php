<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST");
    header("Access-Control-Allow-Headers: Content-Type");

    require 'vendor/autoload.php';

    use Firebase\JWT\JWT;
    use Firebase\JWT\Key;

    $conn = new mysqli("127.0.0.1", "root", "", "rplayer");

    $data1 = file_get_contents("php://input");
    $data2 = json_decode($data1, true);
    $email = mysqli_escape_string($conn, $data2['email']);
    $password = $data2['password'];

    $query = "SELECT * FROM credentials WHERE email = '$email'";
    $result = mysqli_query($conn, $query);
    if(mysqli_num_rows($result) > 0)
    {
        $row = mysqli_fetch_row($result);
        if(password_verify($password, $row[1]))
        {
            $key = "kjhsdkjsbakfjbdkfbsdjhbfjsd";
            $token = JWT::encode(
                array(
                    'iat' => time(),
                    'nbf' => time(),
                    'exp' => time() + 30,
                    'data' => array(
                        'email' => $email,
                        'password' => $password
                    )
                    ),
                    $key,
                    'HS256'
            );
            echo json_encode($token);
        }
        else
        {
            echo json_encode("Wrong password");
        }
    }
    else
    {
        echo json_encode("No user");
    }
?>