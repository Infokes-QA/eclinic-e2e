Feature: Pemesanan Pembelian
  Sebagai pengguna, 
  saya ingin dapat melakukan pemesanan untuk persediaan medis
  Sehingga saya dapat mengelola inventaris saya secara efektif

  @pemesanan_pembelian @regression @e2e @eclinic
  Scenario Outline: User melakukan tambah item pemesanan pembelian
    Given user sudah berada di halaman pemesanan pembelian
    When user menambahkan "<item_name>" pemesanan pembelian
    And user mengisi "<jumlah_order>" item pemesanan pembelian
    And user klik tombol "Tambahkan Item"
    Then item "<item_name>" dengan jumlah order "<jumlah_order>" muncul di daftar pemesanan pembelian
    
    Examples:
      | item_name     | jumlah_order |
      | Atorvastatin  | 10           |
      | Paracetamol   | 5            |

  @pemesanan_pembelian @regression @e2e @eclinic
  Scenario Outline: User melakukan tambah item pemesanan pembelian dengan jumlah order negatif
    Given user sudah berada di halaman pemesanan pembelian
    When user menambahkan "<item_name>" pemesanan pembelian
    And user mengisi "<jumlah_order>" item pemesanan pembelian
    Then tidak bisa menginputkan character negatif pada field jumlah order pemesanan pembelian

    Examples:
      | item_name       | jumlah_order |
      | ETHIGOBAL - 500 | -5           |
      | Lidocaine       | -6           |

# Scenario Outline: User melakukan tambah item pemesanan pembelian dengan jumlah order kosong
#     Given user sudah berada di halaman pemesanan pembelian
#     When user menambahkan "<item_name>" pemesanan pembelian
#     And user mengisi "<jumlah_order>" item pemesanan pembelian
#     And user klik tombol "Tambahkan Item"
#     Then muncul pesan error "Jumlah order tidak boleh kosong"

#     Examples:
#       | item_name       | jumlah_order |
#       | Dental Forceps  |0             |


Scenario Outline: User menambahkan "diskon Keseluruhan" persentase pada pemesanan pembelian
    Given user sudah berada di halaman pemesanan pembelian
    When user memilih "diskon Keseluruhan" pemesanan pembelian
    And user pilih diskon "persen" pada field diskon pemesanan pembelian
    And user mengisi nilai "<diskon>" pada field diskon pemesanan pembelian
    Then Jumalah "<nominal_diskon>" tampil pada field diskon pemesanan pembelian 
    And jumlah bayar pemesanan pembelian akan terupdate menjadi "<total_bayar>"

    Examples:
      | diskon | nominal_diskon | total_bayar  |
      | 10     | 1500           | 13500        |
      | 20     | 3000           | 12000        |

Scenario Outline: User menambahkan "diskon Keseluruhan" nominal pada pemesanan pembelian
    Given user sudah berada di halaman pemesanan pembelian
    When user memilih "diskon Keseluruhan" pemesanan pembelian
    And user pilih diskon "rupiah" pada field diskon pemesanan pembelian
    And user mengisi nilai "<diskon>" pada field diskon pemesanan pembelian
    Then Jumalah "<nominal_diskon>" tampil pada field diskon pemesanan pembelian 
    And jumlah bayar pemesanan pembelian akan terupdate menjadi "<total_bayar>"

    Examples:
      | diskon   | nominal_diskon | total_bayar  |
      | 2000     | 2000           | 13000        |
      | 5000     | 5000           | 10000        |

# Scenario Outline: User menambahkan "diskon per item" persentase pada pemesanan pembelian
#     Given user sudah berada di halaman pemesanan pembelian
#     When user menambahkan "diskon per item" pemesanan pembelian
#     And user pilih diskon "persen" pada field diskon per item pemesanan pembelian
#     And user mengisi nilai <diskon> pada field diskon per item pemesanan pembelian
#     And user tambahkan item pemesanan pembelian
#     And user mengisi jumlah order item pemesanan pembelian
#     And user klik tombol "Tambahkan Item"
#     Then item pemesanan pembelian berhasil ditambahkan dengan diskon yang diberikan
#     And item tampil pada daftar pemesanan pembelian dengan diskon yang diberikan

#     Examples:
#       | diskon |
#       | 5      |
#       | 15     |

# Scenario Outline: User menambahkan "diskon per item" nominal pada pemesanan pembelian
#     Given user sudah berada di halaman pemesanan pembelian
#     When user menambahkan "diskon per item" pemesanan pembelian
#     And user pilih diskon "nominal" pada field diskon per item pemesanan pembelian
#     And user mengisi nilai <diskon> pada field diskon per item pemesanan pembelian
#     And user tambahkan item pemesanan pembelian
#     And user mengisi jumlah order item pemesanan pembelian
#     And user klik tombol "Tambahkan Item"
#     Then item pemesanan pembelian berhasil ditambahkan dengan diskon yang diberikan
#     And item tampil pada daftar pemesanan pembelian dengan diskon yang diberikan

#     Examples:
#       | diskon |
#       | 2000   |
#       | 5000   |

# Scenario: User melakukan simpan draft pemesanan pembelian dengan semua field valid
#     Given user sudah berada di halaman pemesanan pembelian
#     When user menambahkan item pemesanan pembelian
#     And user mengisi jumlah order item pemesanan pembelian
#     And user klik tombol "Tambahkan Item"
#     And user klik tombol "Simpan Draft"
#     Then draft pemesanan pembelian berhasil disimpan
#     And pemesanan pembelian tampil pada daftar pesanan pembelian dengan status persetujuan draft

# Scenario: User melakukan simpan draft dengan Pemasok di kosongkan
#     Given user sudah berada di halaman pemesanan pembelian
#     When user menambahkan item pemesanan pembelian
#     And user mengisi jumlah order item pemesanan pembelian
#     And user klik tombol "Tambahkan Item"
#     And user kosongkan field pemasok pemesanan pembelian
#     And user klik tombol "Simpan Draft"
#     Then draft pemesanan pembelian tidak berhasil disimpan
#     And muncul pesan error "Pemasok wajib diisi & sesuai dengan list pemasok yang terdaftar"

# Scenario: User melakukan  simpan draft dengan penanggung jawab di kosongkan
#     Given user sudah berada di halaman pemesanan pembelian
#     When user menambahkan item pemesanan pembelian
#     And user mengisi jumlah order item pemesanan pembelian
#     And user klik tombol "Tambahkan Item"
#     And user kosongkan field penanggung jawab pemesanan pembelian
#     And user klik tombol "Simpan Draft"
#     Then draft pemesanan pembelian tidak berhasil disimpan
#     And muncul pesan error "Penanggung jawab wajib diisi & sesuai dengan list penanggung jawab yang terdaftar"

# Scenario: User melakukan simpan pemesanan pembelian dengan semua field valid
#     Given user sudah berada di halaman pemesanan pembelian
#     When user menambahkan item pemesanan pembelian
#     And user mengisi jumlah order item pemesanan pembelian
#     And user klik tombol "Tambahkan Item"
#     And user klik tombol "Simpan & Kirim"
#     Then pemesanan pembelian berhasil disimpan
#     And pemesanan pembelian tampil pada daftar pesanan pembelian dengan status menunggu

# Scenario: User melakukan simpan pemesanan pembelian dengan Pemasok di kosongkan
#     Given user sudah berada di halaman pemesanan pembelian
#     When user menambahkan item pemesanan pembelian
#     And user mengisi jumlah order item pemesanan pembelian
#     And user klik tombol "Tambahkan Item"
#     And user kosongkan field pemasok pemesanan pembelian
#     And user klik tombol "Simpan & Kirim"
#     Then pemesanan pembelian tidak berhasil disimpan
#     And muncul pesan error "Pemasok wajib diisi & sesuai dengan list pemasok yang terdaftar"

# Scenario: User melakukan simpan pemesanan pembelian dengan penanggung jawab di kosongkan
#     Given user sudah berada di halaman pemesanan pembelian
#     When user menambahkan item pemesanan pembelian
#     And user mengisi jumlah order item pemesanan pembelian
#     And user klik tombol "Tambahkan Item"
#     And user kosongkan field penanggung jawab pemesanan pembelian
#     And user klik tombol "Simpan & Kirim"
#     Then pemesanan pembelian tidak berhasil disimpan
#     And muncul pesan error "Penanggung jawab wajib diisi & sesuai dengan list penanggung jawab yang terdaftar"

