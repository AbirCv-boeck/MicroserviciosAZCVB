use tonic::transport::Channel;
use vehiculos_proto::vehiculos_client::VehiculosClient;
use vehiculos_proto::CheckRequest;

pub mod vehiculos_proto {
    tonic::include_proto!("vehiculos"); // Generado con prost_build desde vehiculos.proto
}

pub async fn verificar_disponibilidad(vehiculo_id: i32) -> bool {
    let mut client = VehiculosClient::connect("http://[::1]:50051")
        .await
        .expect("Error conectando a gRPC Vehiculos");

    let request = tonic::Request::new(CheckRequest {
        vehiculo_id,
    });

    let response = client.check_disponibilidad(request).await;
    match response {
        Ok(res) => res.into_inner().disponible,
        Err(_) => false,
    }
}
