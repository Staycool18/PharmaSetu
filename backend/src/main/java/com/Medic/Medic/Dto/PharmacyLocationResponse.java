package com.Medic.Medic.Dto;


public class PharmacyLocationResponse {

    private String pharmacyName;
    private String address;
    private double distance;

    public PharmacyLocationResponse(String pharmacyName, String address, double distance) {
        this.pharmacyName = pharmacyName;
        this.address = address;
        this.distance = distance;
    }

    // getters
}
