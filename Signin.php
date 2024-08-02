<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST");
    header("Access-Control-Allow-Headers: Content-Type");

    $conn = new mysqli("127.0.0.1", "root", "", "rplayer");

    $data1 = file_get_contents("php://input");
    $data2 = json_decode($data1, true);
    $email = mysqli_escape_string($conn, $data2['email']);
    $password = $data2['password'];
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    $response = "";

    $query1 = "SELECT * FROM credentials WHERE email = '$email'";
    $result1 = mysqli_query($conn, $query1);
    if(mysqli_num_rows($result1) == 0)
    {
        $query2 = "INSERT INTO credentials VALUES('$email', '$hashed_password')";
        $result2 = mysqli_query($conn, $query2);
        $response = "Fetched";
    }
    else
    {
        $response = "Account Exists";
    }
    echo json_encode($response);
?>