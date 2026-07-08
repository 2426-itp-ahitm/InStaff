plugins {
    alias(libs.plugins.android.application)
}

android {
    namespace = "at.htlleonding.instaff"
    compileSdk {
        version = release(36) {
            minorApiLevel = 1
        }
    }

    defaultConfig {
        applicationId = "at.htlleonding.instaff"
        minSdk = 26
        targetSdk = 36
        versionCode = 1
        versionName = "1.0"
        manifestPlaceholders["appAuthRedirectScheme"] = "at.htlleonding.instaff"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        // Debug builds are for the Android emulator only: 10.0.2.2 points back to the host machine.
        // Do not use these URLs for manually installed APKs on real devices.
        debug {
            buildConfigField("String", "API_BASE_URL", "\"http://10.0.2.2:8080/api/\"")
            buildConfigField("String", "KEYCLOAK_BASE_URL", "\"http://10.0.2.2:8081\"")
            manifestPlaceholders["usesCleartextTraffic"] = "true"
        }

        // Release APKs are installed manually for test runs and must point to the deployed HTTPS setup.
        // Keep cleartext disabled here so accidental http:// production URLs fail fast.
        release {
            isMinifyEnabled = false
            buildConfigField("String", "API_BASE_URL", "\"https://it210157.cloud.htl-leonding.ac.at/api/\"")
            buildConfigField("String", "KEYCLOAK_BASE_URL", "\"https://it210157.cloud.htl-leonding.ac.at/auth\"")
            manifestPlaceholders["usesCleartextTraffic"] = "false"
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }

    buildFeatures {
        viewBinding = true
        buildConfig = true
    }

    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {
    implementation(libs.core)
    implementation(libs.appcompat)
    implementation(libs.material)
    implementation(libs.constraintlayout)
    implementation(libs.activity)
    implementation(libs.fragment)
    implementation(libs.lifecycle.livedata)
    implementation(libs.lifecycle.viewmodel)
    implementation(libs.lifecycle.common)
    implementation(libs.navigation.fragment)
    implementation(libs.navigation.ui)
    implementation(libs.recyclerview)
    implementation(libs.retrofit)
    implementation(libs.retrofit.gson)
    implementation(libs.gson)
    implementation(libs.okhttp)
    implementation(libs.okhttp.logging)
    implementation(libs.appauth)
    testImplementation(libs.junit)
    testImplementation(libs.mockwebserver)
    androidTestImplementation(libs.ext.junit)
    androidTestImplementation(libs.espresso.core)
}
