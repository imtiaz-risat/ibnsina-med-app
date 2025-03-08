import React from "react";
import { PiPrescriptionBold } from "react-icons/pi";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    padding: 20,
  },
  header: {
    marginBottom: 10,
    textAlign: "center",
    padding: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 3,
  },
  infoBox: {
    border: "1pt solid black",
    padding: 10,
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  infoItem: {
    flexDirection: "row",
    marginRight: 10,
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: "bold",
    marginRight: 5,
  },
  infoValue: {
    fontSize: 10,
  },
  columns: {
    flexDirection: "row",
    marginTop: 10,
  },
  leftColumn: {
    width: "30%",
    paddingRight: 10,
    borderRight: "1pt solid black",
  },
  rightColumn: {
    width: "70%",
    paddingLeft: 10,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "extra-bold",
    marginBottom: 5,
    marginTop: 6,
  },
  sectionContent: {
    paddingLeft: 15,
    marginBottom: 6,
  },
  sectionItem: {
    fontSize: 10,
    marginBottom: 2,
  },
  rxSymbol: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 5,
  },
  treatmentItem: {
    marginBottom: 10,
  },
  treatmentHeader: {
    fontSize: 11,
    fontWeight: "bold",
  },
  treatmentDetail: {
    fontSize: 10,
    paddingLeft: 15,
  },
  signature: {
    marginTop: 30,
    alignItems: "flex-end",
  },
  signatureLine: {
    borderTop: "1pt solid black",
    width: 120,
  },
  signatureText: {
    fontSize: 10,
    marginTop: 5,
    textAlign: "center",
  },
  imageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
    marginBottom: 10,
  },
  examImage: {
    width: "90%",
    aspectRatio: 1,
  },
});

const PrescriptionPDF = ({ prescription }) => {
  console.log("prescription pdf data:" + JSON.stringify(prescription));

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>IBN SINA MEDICAL CENTER</Text>
          <Text style={styles.subtitle}>
            Address: 123 Medical Street, Dhaka | Phone: +880 1234-567890
          </Text>
        </View>

        {/* Patient & Doctor Info Box */}
        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Patient ID :</Text>
              <Text style={styles.infoValue}>
                {prescription.patientId || "N/A"}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Patient Name :</Text>
              <Text style={styles.infoValue}>
                {prescription.patientName || "N/A"}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Date :</Text>
              <Text style={styles.infoValue}>
                {prescription.prescriptionDateCreated
                  ? new Date(
                      prescription.prescriptionDateCreated
                    ).toLocaleDateString()
                  : "N/A"}
              </Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Marital Status :</Text>
              <Text style={styles.infoValue}>
                {prescription.maritalStatus || "N/A"}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Age :</Text>
              <Text style={styles.infoValue}>{prescription.age || "N/A"}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Prescripted By :</Text>
              <Text style={styles.infoValue}>
                {prescription.doctorName || "N/A"}
              </Text>
            </View>
          </View>
        </View>

        {/* Main Content - Two Columns */}
        <View style={styles.columns}>
          {/* Left Column */}
          <View style={styles.leftColumn}>
            {/* Patient Complaints */}
            {prescription.complaints?.length > 0 ? (
              <View>
                <Text style={styles.sectionHeader}>Patient Complaints</Text>
                <View style={styles.sectionContent}>
                  {prescription.complaints.map((item, index) => (
                    <Text key={index} style={styles.sectionItem}>
                      {item.topic} : {item.value}
                    </Text>
                  ))}
                </View>
              </View>
            ) : (
              <></>
            )}

            {/* Personal History */}
            {prescription.personalHistory?.length > 0 ? (
              <View>
                <Text style={styles.sectionHeader}>Personal History</Text>
                <View style={styles.sectionContent}>
                  {prescription.personalHistory.map((item, index) => (
                    <Text key={index} style={styles.sectionItem}>
                      {item.topic} : {item.value}
                    </Text>
                  ))}
                </View>
              </View>
            ) : (
              <></>
            )}

            {/* Family History */}
            {prescription.familyHistory?.length > 0 ? (
              <View>
                <Text style={styles.sectionHeader}>Family History</Text>
                <View style={styles.sectionContent}>
                  {prescription.familyHistory.map((item, index) => (
                    <Text key={index} style={styles.sectionItem}>
                      {item.topic} : {item.value}
                    </Text>
                  ))}
                </View>
              </View>
            ) : (
              <></>
            )}

            {/* Medical History */}
            {prescription.medicalHistory?.length > 0 ? (
              <View>
                <Text style={styles.sectionHeader}>Medical History</Text>
                <View style={styles.sectionContent}>
                  {prescription.medicalHistory.map((item, index) => (
                    <Text key={index} style={styles.sectionItem}>
                      {item.topic} : {item.value}
                    </Text>
                  ))}
                </View>
              </View>
            ) : (
              <></>
            )}

            {/* Surgical History */}
            {prescription.surgicalHistory?.length > 0 ? (
              <View>
                <Text style={styles.sectionHeader}>Surgical History</Text>
                <View style={styles.sectionContent}>
                  {prescription.surgicalHistory.map((item, index) => (
                    <Text key={index} style={styles.sectionItem}>
                      {item.topic} : {item.value}
                    </Text>
                  ))}
                </View>
              </View>
            ) : (
              <></>
            )}

            {/* Drug History */}
            {prescription.drugHistory?.length > 0 ? (
              <View>
                <Text style={styles.sectionHeader}>Drug History</Text>
                <View style={styles.sectionContent}>
                  {prescription.drugHistory.map((item, index) => (
                    <Text key={index} style={styles.sectionItem}>
                      {item.topic} : {item.value}
                    </Text>
                  ))}
                </View>
              </View>
            ) : (
              <></>
            )}

            {/* Examination Findings */}
            {prescription.examinationFinding?.length > 0 ? (
              <View>
                <Text style={styles.sectionHeader}>Examinations Findings</Text>
                <View style={styles.sectionContent}>
                  {prescription.examinationFinding.map((item, index) => (
                    <View>
                      <Text key={index} style={styles.sectionItem}>
                        {item.topic} : {item.value}
                      </Text>
                      {item.topic === "Breast" && (
                        <Image
                          src="/examfindingimage/breast.png"
                          style={styles.examImage}
                        />
                      )}
                      {item.topic === "Abdomen" && (
                        <Image
                          src="/examfindingimage/abdomen.png"
                          style={styles.examImage}
                        />
                      )}
                      {item.topic === "P-R Examination" && (
                        <Image
                          src="/examfindingimage/pr-exam.png"
                          style={styles.examImage}
                        />
                      )}
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              <></>
            )}

            {/* Diagnosis */}
            {prescription.diagnosis?.length > 0 ? (
              <View>
                <Text style={styles.sectionHeader}>Diagnosis</Text>
                <View style={styles.sectionContent}>
                  {prescription.diagnosis.map((item, index) => (
                    <Text key={index} style={styles.sectionItem}>
                      {item.topic} : {item.value}
                    </Text>
                  ))}
                </View>
              </View>
            ) : (
              <></>
            )}

            {/* Management Plan */}
            {prescription.managementPlan?.length > 0 ? (
              <View>
                <Text style={styles.sectionHeader}>Management Plan</Text>
                <View style={styles.sectionContent}>
                  {prescription.managementPlan.map((item, index) => (
                    <Text key={index} style={styles.sectionItem}>
                      {item.topic} : {item.value}
                    </Text>
                  ))}
                </View>
              </View>
            ) : (
              <></>
            )}
          </View>
          <View style={styles.rightColumn}>
            {/* Investigation */}
            {prescription.investigation?.length > 0 ? (
              <View>
                <Text style={styles.sectionHeader}>Investigation</Text>
                <View style={styles.sectionContent}>
                  {prescription.investigation.map((item, index) => (
                    <Text key={index} style={styles.sectionItem}>
                      {item.topic} : {item.value}
                    </Text>
                  ))}
                </View>
              </View>
            ) : (
              <></>
            )}
            {/* Rx Symbol */} {/* ℞ */}
            <Text style={styles.rxSymbol}>Rx</Text>
            {/* Treatments */}
            <View>
              {prescription.treatments?.length > 0 ? (
                prescription.treatments.map((treatment, index) => (
                  <View key={index} style={styles.treatmentItem}>
                    <Text style={styles.treatmentHeader}>
                      {index + 1}. {treatment.drugName}
                    </Text>
                    <Text style={styles.treatmentDetail}>
                      {treatment.dose} --- {treatment.rule} ---{" "}
                      {treatment.duration}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.sectionItem}>No treatments prescribed</Text>
              )}
            </View>
            {/* Advice */}
            <View>
              <Text style={styles.sectionHeader}>Advice</Text>
              <View style={styles.sectionContent}>
                {prescription.advice?.length > 0 ? (
                  prescription.advice.map((item, index) => (
                    <Text key={index} style={styles.sectionItem}>
                      {item.topic} : {item.value}
                    </Text>
                  ))
                ) : (
                  <Text style={styles.sectionItem}>None</Text>
                )}
              </View>
            </View>
            {/* Next Follow Up */}
            <View>
              <Text style={styles.sectionHeader}>Next Follow Up</Text>
              <View style={styles.sectionContent}>
                {prescription.hasNextVisit ? (
                  <Text style={styles.sectionItem}>
                    {new Date(prescription.nextVisitDate).toLocaleDateString()}
                  </Text>
                ) : (
                  <Text style={styles.sectionItem}>N/A</Text>
                )}
              </View>
            </View>
            {/* Signature */}
            <View style={styles.signature}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureText}>
                {prescription.doctorName || "Doctor's Signature"}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PrescriptionPDF;
